import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  screenId: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true, index: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  pricingPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingPolicy', required: true },
  startsAt: { type: Date, required: true, index: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ['SCHEDULED', 'CANCELLED', 'COMPLETED'], default: 'SCHEDULED', required: true, index: true }
}, { timestamps: true });

showSchema.index({ screenId: 1, startsAt: 1 });
showSchema.index({ movieId: 1, startsAt: 1, status: 1 });
export const Show = mongoose.model('Show', showSchema);
