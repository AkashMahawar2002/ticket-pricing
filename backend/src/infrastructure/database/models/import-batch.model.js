import mongoose from 'mongoose';

const importBatchSchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  initiatedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sourceType: { type: String, enum: ['CSV'], required: true, default: 'CSV' },
  status: { type: String, enum: ['APPLIED', 'REJECTED'], required: true },
  totalRecords: { type: Number, required: true },
  acceptedRecords: { type: Number, required: true },
  duplicateRecords: { type: Number, required: true },
  rejectedRecords: { type: Number, required: true },
  records: { type: [mongoose.Schema.Types.Mixed], required: true }
}, { timestamps: true });

importBatchSchema.index({ showId: 1, createdAt: -1 });
export const ImportBatch = mongoose.model('ImportBatch', importBatchSchema);
