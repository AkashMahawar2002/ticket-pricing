import argon2 from 'argon2';
import { connectToDatabase, disconnectFromDatabase } from '../database/mongoose.js';
import { Cinema, Screen, Movie, Show, TicketTier, ShowTierInventory, PricingPolicy, User, ImportBatch } from '../database/models/index.js';
import { DEVELOPMENT_CREDENTIALS } from './development-data.js';

await connectToDatabase();

try {
  await Promise.all([Cinema.deleteMany({}), Screen.deleteMany({}), Movie.deleteMany({}), Show.deleteMany({}), TicketTier.deleteMany({}), ShowTierInventory.deleteMany({}), PricingPolicy.deleteMany({}), User.deleteMany({}), ImportBatch.deleteMany({})]);

  const [cinemaOne, cinemaTwo] = await Cinema.create([
    { name: 'Starlight Central', city: 'Bengaluru', address: '42 Residency Road', status: 'ACTIVE' },
    { name: 'North Avenue Multiplex', city: 'Pune', address: '18 University Road', status: 'ACTIVE' }
  ]);
  const screens = await Screen.create([
    { cinemaId: cinemaOne._id, name: 'Screen 1', status: 'ACTIVE' },
    { cinemaId: cinemaOne._id, name: 'Screen 2', status: 'ACTIVE' },
    { cinemaId: cinemaTwo._id, name: 'Screen 1', status: 'ACTIVE' }
  ]);
  const movies = await Movie.create([
    { title: 'The Last Signal', synopsis: 'A mystery unfolds after a final broadcast.', runtimeMinutes: 128, language: 'English' },
    { title: 'Monsoon Letters', synopsis: 'Two old friends reconnect through a box of letters.', runtimeMinutes: 116, language: 'Hindi' },
    { title: 'Orbit Seven', synopsis: 'A crew races home from the edge of space.', runtimeMinutes: 142, language: 'English' }
  ]);
  const tiers = await TicketTier.create([
    { code: 'SILVER', name: 'Silver', displayOrder: 1 },
    { code: 'GOLD', name: 'Gold', displayOrder: 2 },
    { code: 'RECLINER', name: 'Recliner', displayOrder: 3 }
  ]);
  const policy = await PricingPolicy.create({
    policyVersion: 'development-2026-01',
    festivalDiscount: { type: 'FLAT_BOOKING', amountPaise: 5000n, basisPoints: 0 },
    membershipDiscountBasisPoints: 1000,
    membershipDiscountCapPaise: 15000n,
    convenienceFeePaise: 300n,
    gstBasisPoints: 1800,
    taxableComponents: { ticketSubtotal: true, convenienceFee: true },
    roundingMode: 'HALF_UP',
    discountOrder: ['FESTIVAL', 'MEMBERSHIP'],
    validFrom: new Date('2026-01-01T00:00:00Z'),
    active: true
  });
  const starts = [new Date(Date.now() + 86400000), new Date(Date.now() + 172800000), new Date(Date.now() + 259200000)];
  const shows = await Show.create([
    { screenId: screens[0]._id, movieId: movies[0]._id, pricingPolicyId: policy._id, startsAt: starts[0], endsAt: new Date(starts[0].getTime() + 128 * 60000) },
    { screenId: screens[1]._id, movieId: movies[1]._id, pricingPolicyId: policy._id, startsAt: starts[1], endsAt: new Date(starts[1].getTime() + 116 * 60000) },
    { screenId: screens[2]._id, movieId: movies[2]._id, pricingPolicyId: policy._id, startsAt: starts[2], endsAt: new Date(starts[2].getTime() + 142 * 60000) }
  ]);
  const prices = [15000n, 22000n, 35000n];
  const inventory = [];
  shows.forEach((show, showIndex) => tiers.forEach((tier, tierIndex) => inventory.push({
    showId: show._id,
    tierId: tier._id,
    unitPricePaise: prices[tierIndex] + BigInt(showIndex * 1000),
    capacity: tierIndex === 0 ? 80 : tierIndex === 1 ? 40 : 12,
    heldQuantity: 0,
    bookedQuantity: showIndex === 0 && tierIndex === 2 ? 12 : showIndex === 1 && tierIndex === 1 ? 35 : 0,
    active: true,
    version: 0
  })));
  await ShowTierInventory.create(inventory);
  const passwordHash = await argon2.hash(DEVELOPMENT_CREDENTIALS.password, { type: argon2.argon2id });
  await User.create({ name: 'Development Member', email: DEVELOPMENT_CREDENTIALS.email, normalizedEmail: DEVELOPMENT_CREDENTIALS.email, passwordHash, membershipStatus: 'ACTIVE' });

  console.log('Development seed complete. Credentials are development-only:', DEVELOPMENT_CREDENTIALS.email);
} finally {
  await disconnectFromDatabase();
}
