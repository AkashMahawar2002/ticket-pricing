import mongoose from 'mongoose';

const pricingPolicySchema = new mongoose.Schema({
  policyVersion: { type: String, required: true, trim: true },
  festivalDiscount: {
    type: {
      type: String,
      enum: ['NONE', 'FLAT_BOOKING', 'FLAT_TICKET', 'PERCENTAGE'],
      default: 'NONE',
      required: true
    },
    amountPaise: { type: mongoose.Schema.Types.BigInt, default: 0n, min: 0n },
    basisPoints: { type: Number, default: 0, min: 0, max: 10000 }
  },
  membershipDiscountBasisPoints: { type: Number, required: true, default: 0, min: 0, max: 10000 },
  membershipDiscountCapPaise: { type: mongoose.Schema.Types.BigInt, required: true, default: 0n, min: 0n },
  convenienceFeePaise: { type: mongoose.Schema.Types.BigInt, required: true, default: 0n, min: 0n },
  gstBasisPoints: { type: Number, required: true, default: 0, min: 0, max: 10000 },
  taxableComponents: {
    ticketSubtotal: { type: Boolean, default: true },
    convenienceFee: { type: Boolean, default: true }
  },
  roundingMode: { type: String, enum: ['HALF_UP', 'DOWN', 'UP'], required: true, default: 'HALF_UP' },
  discountOrder: { type: [String], required: true, default: ['FESTIVAL', 'MEMBERSHIP'] },
  validFrom: { type: Date, required: true, index: true },
  validUntil: { type: Date, index: true },
  active: { type: Boolean, required: true, default: true, index: true }
}, { timestamps: true });

pricingPolicySchema.index({ policyVersion: 1 }, { unique: true });
pricingPolicySchema.index({ active: 1, validFrom: 1, validUntil: 1 });
export const PricingPolicy = mongoose.model('PricingPolicy', pricingPolicySchema);
