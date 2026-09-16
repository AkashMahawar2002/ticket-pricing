import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  synopsis: { type: String, trim: true, maxlength: 2000 },
  runtimeMinutes: { type: Number, required: true, min: 1, max: 600 },
  language: { type: String, required: true, trim: true, maxlength: 50 },
  status: { type: String, enum: ['DRAFT', 'ACTIVE', 'INACTIVE'], default: 'ACTIVE', required: true, index: true }
}, { timestamps: true });

movieSchema.index({ title: 1, status: 1 });
export const Movie = mongoose.model('Movie', movieSchema);
