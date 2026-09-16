import mongoose from 'mongoose';

const idempotencyRecordSchema = new mongoose.Schema({
  key: { type: String, required: true, trim: true },
  operation: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  requestFingerprint: { type: String, required: true },
  status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED', 'FAILED'], required: true, default: 'IN_PROGRESS' },
  responseStatusCode: { type: Number, min: 100, max: 599 },
  responseBody: { type: mongoose.Schema.Types.Mixed },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

idempotencyRecordSchema.index({ key: 1, operation: 1, userId: 1 }, { unique: true });
idempotencyRecordSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const IdempotencyRecord = mongoose.model('IdempotencyRecord', idempotencyRecordSchema);
