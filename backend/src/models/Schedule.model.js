import mongoose from 'mongoose';

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

export const Schedule = mongoose.model('Schedule', scheduleSchema);
