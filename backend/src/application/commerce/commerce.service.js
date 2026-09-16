import mongoose from 'mongoose';
import { AppError } from '../../shared/errors/app-error.js';
import { Cinema, Show, Screen, Movie, TicketTier, ShowTierInventory, PricingPolicy, Booking, BookingItem, BookingAdjustment, ImportBatch } from '../../infrastructure/database/models/index.js';
import { calculatePrice } from '../../domain/pricing/pricing-engine.js';
import { normalizePriceList, parsePriceList } from '../../domain/imports/price-list.js';

function showQuery() {
  return Show.find({ status: 'SCHEDULED', startsAt: { $gt: new Date() } }).populate({ path: 'screenId', populate: { path: 'cinemaId' } }).populate('movieId').sort({ startsAt: 1 });
}

async function getShowData(showId, session) {
  let showQuery = Show.findById(showId).populate({ path: 'screenId', populate: { path: 'cinemaId' } }).populate('movieId');
  if (session) showQuery = showQuery.session(session);
  const show = await showQuery;
  if (!show || show.status !== 'SCHEDULED') throw new AppError('Show not found.', 404, 'SHOW_NOT_FOUND');
  let inventoryQuery = ShowTierInventory.find({ showId, active: true }).populate('tierId').sort({ 'tierId.displayOrder': 1 });
  let policyQuery = PricingPolicy.findById(show.pricingPolicyId);
  if (session) { inventoryQuery = inventoryQuery.session(session); policyQuery = policyQuery.session(session); }
  const [inventory, policy] = await Promise.all([inventoryQuery, policyQuery]);
  if (!policy) throw new AppError('Pricing policy not found.', 500, 'PRICING_POLICY_NOT_FOUND');
  return { show, inventory, policy };
}

function availability(item) { return Math.max(0, item.capacity - item.heldQuantity - item.bookedQuantity); }

export async function listCatalog() {
  const [cinemas, shows] = await Promise.all([Cinema.find({ status: 'ACTIVE' }).sort({ name: 1 }), showQuery()]);
  return { cinemas, shows: shows.map((show) => ({ id: show._id, movie: show.movieId, screen: show.screenId, startsAt: show.startsAt, endsAt: show.endsAt })) };
}

export async function getShow(showId) {
  const data = await getShowData(showId);
  return { show: data.show, movie: data.show.movieId, cinema: data.show.screenId.cinemaId, tiers: data.inventory.map((item) => ({ id: item.tierId._id, code: item.tierId.code, name: item.tierId.name, unitPricePaise: item.unitPricePaise.toString(), available: availability(item) })) };
}

export async function quote({ showId, items, membershipStatus }) {
  const data = await getShowData(showId);
  const byCode = new Map(data.inventory.map((entry) => [entry.tierId.code, entry]));
  const pricingItems = items.map((item) => {
    const entry = byCode.get(item.tierCode.toUpperCase());
    if (!entry) throw new AppError(`Tier ${item.tierCode} is unavailable.`, 400, 'TIER_UNAVAILABLE');
    if (availability(entry) < item.quantity) throw new AppError(`Not enough ${item.tierCode} tickets are available.`, 409, 'INSUFFICIENT_INVENTORY');
    return { tierCode: entry.tierId.code, tierName: entry.tierId.name, quantity: item.quantity, unitPricePaise: entry.unitPricePaise };
  });
  return calculatePrice({ items: pricingItems, policy: data.policy.toObject(), membershipStatus });
}

export async function importPrices({ showId, userId, csvText }) {
  const data = await getShowData(showId);
  const records = parsePriceList(csvText);
  const normalized = normalizePriceList(records, data.inventory.map((entry) => entry.tierId));
  const accepted = normalized.accepted;
  const session = await mongoose.startSession();
  try {
    let report;
    await session.withTransaction(async () => {
      for (const record of accepted) await ShowTierInventory.updateOne({ showId, tierId: record.tierId }, { $set: { unitPricePaise: record.normalizedPricePaise }, $inc: { version: 1 } }, { session });
      const serializedRecords = normalized.results.map((record) => ({ ...record, normalizedPricePaise: record.normalizedPricePaise?.toString(), tierId: record.tierId?.toString() }));
      report = await ImportBatch.create([{ showId, initiatedByUserId: userId, status: accepted.length ? 'APPLIED' : 'REJECTED', totalRecords: records.length, acceptedRecords: normalized.results.filter((r) => r.classification === 'ACCEPTED').length, duplicateRecords: normalized.results.filter((r) => r.classification === 'DUPLICATE').length, rejectedRecords: normalized.results.filter((r) => r.classification === 'REJECTED').length, records: serializedRecords }], { session });
    });
    return report[0] || report;
  } finally { await session.endSession(); }
}

export async function createBooking({ showId, user, items }) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const data = await getShowData(showId, session);
      const byCode = new Map(data.inventory.map((entry) => [entry.tierId.code, entry]));
      const pricingItems = [];
      for (const requested of items) {
        const entry = byCode.get(requested.tierCode.toUpperCase());
        if (!entry) throw new AppError('Ticket tier is unavailable.', 400, 'TIER_UNAVAILABLE');
        const updated = await ShowTierInventory.findOneAndUpdate({ _id: entry._id, bookedQuantity: { $lte: entry.capacity - entry.heldQuantity - requested.quantity } }, { $inc: { bookedQuantity: requested.quantity, version: 1 } }, { session, new: true });
        if (!updated) throw new AppError('Inventory changed. Please review your tickets.', 409, 'INSUFFICIENT_INVENTORY');
        pricingItems.push({ tierCode: entry.tierId.code, tierName: entry.tierId.name, quantity: requested.quantity, unitPricePaise: entry.unitPricePaise });
      }
      const price = calculatePrice({ items: pricingItems, policy: data.policy.toObject(), membershipStatus: user.membershipStatus });
      const booking = await Booking.create([{ userId: user._id, showId, status: 'CONFIRMED', currency: 'INR', subtotalPaise: price.subtotalPaise, discountPaise: price.discountPaise, convenienceFeePaise: price.convenienceFeePaise, gstPaise: price.gstPaise, totalPaise: price.totalPaise, pricingPolicyVersion: data.policy.policyVersion, pricingSnapshot: { policyVersion: data.policy.policyVersion, items: price.items.map((item) => ({ tierCode: item.tierCode, quantity: item.quantity, unitPricePaise: item.unitPricePaise.toString() })) } }], { session });
      const bookingItems = await BookingItem.create(price.items.map((item) => ({ bookingId: booking[0]._id, tierId: byCode.get(item.tierCode).tierId._id, tierCodeSnapshot: item.tierCode, tierNameSnapshot: item.tierName, quantity: item.quantity, unitPricePaise: item.unitPricePaise, lineSubtotalPaise: item.lineSubtotalPaise })), { session });
      await BookingAdjustment.create(price.discounts.map((discount) => ({ bookingId: booking[0]._id, type: discount.type, description: discount.description, amountPaise: discount.amountPaise })), { session });
      result = { booking: booking[0], items: bookingItems, price };
    });
    return result;
  } finally { await session.endSession(); }
}

export async function listBookings(userId) { return Booking.find({ userId }).sort({ createdAt: -1 }); }
export async function getBooking(userId, bookingId) { if (!mongoose.isValidObjectId(bookingId)) throw new AppError('Booking not found.', 404, 'BOOKING_NOT_FOUND'); const booking = await Booking.findOne({ _id: bookingId, userId }).populate('showId'); if (!booking) throw new AppError('Booking not found.', 404, 'BOOKING_NOT_FOUND'); return booking; }
