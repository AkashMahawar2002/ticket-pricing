import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 160 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  address: { type: String, required: true, trim: true, maxlength: 300 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', required: true, index: true }
}, { timestamps: true });

cinemaSchema.index({ city: 1, status: 1 });
export const Cinema = mongoose.model('Cinema', cinemaSchema);
