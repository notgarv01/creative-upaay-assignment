import { Movie } from '../models/Movie.model.js';

// Get all movies handler
export async function getMovies(req, res) {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve movies.' });
  }
}

// Get movie details handler
export async function getMovieById(req, res) {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found.' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve movie details.' });
  }
}
