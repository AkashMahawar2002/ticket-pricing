import mongoose from 'mongoose';

const ticketTierSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, trim: true, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  displayOrder: { type: Number, required: true, min: 0 },
  active: { type: Boolean, default: true, required: true, index: true }
}, { timestamps: true });

export const TicketTier = mongoose.model('TicketTier', ticketTierSchema);
