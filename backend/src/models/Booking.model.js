import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seats: [{ type: String, required: true }],
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  transactionDate: { type: Date, default: Date.now },
  qrCodeUrl: { type: String }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
