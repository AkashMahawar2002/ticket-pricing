import { successResponse } from '../../shared/http/api-response.js';
import { serializeMoney, serializeQuote } from '../../shared/http/serialize.js';
import * as service from '../../application/commerce/commerce.service.js';

export async function catalog(_req, res) { return successResponse(res, await service.listCatalog()); }
export async function show(req, res) { return successResponse(res, await service.getShow(req.params.showId)); }
export async function quote(req, res) { return successResponse(res, { quote: serializeQuote(await service.quote({ showId: req.params.showId, items: req.body.items, membershipStatus: req.auth.user.membershipStatus })) }); }
export async function importPrices(req, res) { return successResponse(res, { report: await service.importPrices({ showId: req.params.showId, userId: req.auth.userId, csvText: req.body.csvText }) }, 201); }
export async function createBooking(req, res) { const result = await service.createBooking({ showId: req.params.showId, user: req.auth.user, items: req.body.items }); return successResponse(res, { booking: { id: result.booking._id, status: result.booking.status, totalPaise: serializeMoney(result.booking.totalPaise) }, invoice: serializeQuote(result.price) }, 201); }
export async function listBookings(req, res) { const bookings = await service.listBookings(req.auth.userId); return successResponse(res, { bookings: bookings.map((booking) => ({ id: booking._id, showId: booking.showId, status: booking.status, totalPaise: serializeMoney(booking.totalPaise), createdAt: booking.createdAt })) }); }
export async function getBooking(req, res) { const booking = await service.getBooking(req.auth.userId, req.params.bookingId); return successResponse(res, { booking: { id: booking._id, showId: booking.showId, status: booking.status, totalPaise: serializeMoney(booking.totalPaise), subtotalPaise: serializeMoney(booking.subtotalPaise), discountPaise: serializeMoney(booking.discountPaise), convenienceFeePaise: serializeMoney(booking.convenienceFeePaise), gstPaise: serializeMoney(booking.gstPaise), createdAt: booking.createdAt } }); }
