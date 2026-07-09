import mongoose from 'mongoose';

const seatLockSchema = new mongoose.Schema({
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seat: { type: String, required: true }, // e.g. "A-1"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // TTL 5 minutes (300 seconds)
});

// Compound unique index to prevent double-locking of the same seat
seatLockSchema.index({ scheduleId: 1, seat: 1 }, { unique: true });

export const SeatLock = mongoose.model('SeatLock', seatLockSchema);
