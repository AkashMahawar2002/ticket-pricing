import mongoose from 'mongoose';

const showTierInventorySchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  tierId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketTier', required: true },
  unitPricePaise: { type: mongoose.Schema.Types.BigInt, required: true, min: 0n },
  capacity: { type: Number, required: true, min: 0 },
  heldQuantity: { type: Number, required: true, default: 0, min: 0 },
  bookedQuantity: { type: Number, required: true, default: 0, min: 0 },
  active: { type: Boolean, required: true, default: true },
  version: { type: Number, required: true, default: 0, min: 0 }
}, { timestamps: true });

showTierInventorySchema.index({ showId: 1, tierId: 1 }, { unique: true });
showTierInventorySchema.index({ showId: 1, active: 1 });
export const ShowTierInventory = mongoose.model('ShowTierInventory', showTierInventorySchema);
