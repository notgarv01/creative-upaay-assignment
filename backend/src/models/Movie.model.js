import mongoose from 'mongoose';

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

export const Movie = mongoose.model('Movie', movieSchema);
