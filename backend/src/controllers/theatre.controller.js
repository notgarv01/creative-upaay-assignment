import { Theatre } from '../models/Theatre.model.js';

// Get all theatres handler
export async function getTheatres(req, res) {
  try {
    const theatres = await Theatre.find({});
    res.json(theatres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve theatres.' });
  }
}
