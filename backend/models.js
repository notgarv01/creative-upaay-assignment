import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Movie Schema
const castSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genres: [{ type: String }],
  synopsis: { type: String, required: true },
  score: { type: Number, required: true },
  pgRating: { type: String, required: true },
  releaseDate: { type: String, required: true },
  formats: [{ type: String }], // e.g. ["2D", "3D"]
  cast: [castSchema],
  posterImage: { type: String, required: true },
  bannerImage: { type: String, required: true },
  status: { type: String, enum: ['now', 'soon'], default: 'now' } // now showing or coming soon
}, { timestamps: true });

// Theatre Schema
const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  logo: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true }
}, { timestamps: true });

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
  date: { type: String, required: true }, // e.g. "Fri 10" or "Friday, October 10"
  format: { type: String, required: true }, // e.g. "2D" or "3D"
  screen: { type: String, required: true }, // e.g. "Screen 1"
  time: { type: String, required: true }, // e.g. "10:00 AM"
  price: { type: Number, required: true },
  occupiedSeats: [{ type: String }] // e.g. ["A-1", "H-10"]
}, { timestamps: true });

// SeatLock Schema (Distributed lock simulation via unique index and TTL)
const seatLockSchema = new mongoose.Schema({
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seat: { type: String, required: true }, // e.g. "A-1"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // TTL 5 minutes (300 seconds)
});

// Compound unique index to prevent double-locking of the same seat
seatLockSchema.index({ scheduleId: 1, seat: 1 }, { unique: true });

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seats: [{ type: String, required: true }],
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  transactionDate: { type: Date, default: Date.now },
  qrCodeUrl: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Movie = mongoose.model('Movie', movieSchema);
export const Theatre = mongoose.model('Theatre', theatreSchema);
export const Schedule = mongoose.model('Schedule', scheduleSchema);
export const SeatLock = mongoose.model('SeatLock', seatLockSchema);
export const Booking = mongoose.model('Booking', bookingSchema);
