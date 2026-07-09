import mongoose from 'mongoose';

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  logo: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true }
}, { timestamps: true });

export const Theatre = mongoose.model('Theatre', theatreSchema);
