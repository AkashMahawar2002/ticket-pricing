import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', required: true }
}, { timestamps: true });

screenSchema.index({ cinemaId: 1, name: 1 }, { unique: true });
export const Screen = mongoose.model('Screen', screenSchema);
