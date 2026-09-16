import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketTier', required: true },
  tierCodeSnapshot: { type: String, required: true, trim: true },
  tierNameSnapshot: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPricePaise: { type: mongoose.Schema.Types.BigInt, required: true, min: 0n },
  lineSubtotalPaise: { type: mongoose.Schema.Types.BigInt, required: true, min: 0n }
}, { timestamps: true });

bookingItemSchema.index({ bookingId: 1, tierId: 1 }, { unique: true });
export const BookingItem = mongoose.model('BookingItem', bookingItemSchema);
