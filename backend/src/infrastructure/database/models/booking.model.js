import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'], required: true, default: 'PENDING', index: true },
  currency: { type: String, required: true, uppercase: true, default: 'INR', minlength: 3, maxlength: 3 },
  subtotalPaise: { type: mongoose.Schema.Types.BigInt, required: true, min: 0n },
  discountPaise: { type: mongoose.Schema.Types.BigInt, required: true, default: 0n, min: 0n },
  convenienceFeePaise: { type: mongoose.Schema.Types.BigInt, required: true, default: 0n, min: 0n },
  gstPaise: { type: mongoose.Schema.Types.BigInt, required: true, default: 0n, min: 0n },
  totalPaise: { type: mongoose.Schema.Types.BigInt, required: true, min: 0n },
  pricingPolicyVersion: { type: String, required: true, trim: true },
  pricingSnapshot: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ userId: 1, status: 1, createdAt: -1 });
bookingSchema.index({ showId: 1, status: 1 });
export const Booking = mongoose.model('Booking', bookingSchema);
