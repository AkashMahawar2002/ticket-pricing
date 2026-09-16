import mongoose from 'mongoose';

const bookingAdjustmentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  type: { type: String, enum: ['FESTIVAL_DISCOUNT', 'MEMBERSHIP_DISCOUNT', 'OTHER'], required: true },
  description: { type: String, required: true, trim: true, maxlength: 300 },
  amountPaise: { type: mongoose.Schema.Types.BigInt, required: true, min: 0n },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const BookingAdjustment = mongoose.model('BookingAdjustment', bookingAdjustmentSchema);
