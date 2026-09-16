import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, maxlength: 320 },
  normalizedEmail: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  membershipStatus: { type: String, enum: ['NONE', 'ACTIVE', 'INACTIVE'], default: 'NONE', required: true, index: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
