import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, Movie, Theatre, Schedule, Booking, SeatLock } from './models.js';
import { acquireSeatLocks, releaseSeatLocks } from './lockService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || '763524c05b4a0ddb0ae8afeb2465611f4419b4b6';

// Authentication Middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// ================= AUTH ROUTES =================

// Register User
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login User
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Current User Details
router.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ================= MOVIE ROUTES =================

// Get all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve movies.' });
  }
});

// Get movie details by id
router.get('/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found.' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve movie details.' });
  }
});


// ================= THEATRE ROUTES =================

// Get all theatres
router.get('/theatres', async (req, res) => {
  try {
    const theatres = await Theatre.find({});
    res.json(theatres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve theatres.' });
  }
});


// ================= SCHEDULE ROUTES =================

// Get schedules for a movie in a theatre for a specific date
router.get('/schedules', async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;
    if (!movieId || !theatreId || !date) {
      return res.status(400).json({ error: 'movieId, theatreId and date are required.' });
    }

    const query = {
      movieId: mongoose.Types.ObjectId.createFromHexString(movieId),
      theatreId: mongoose.Types.ObjectId.createFromHexString(theatreId),
      date
    };

    const schedules = await Schedule.find(query);
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to retrieve schedules.' });
  }
});


// ================= BOOKING & TRANSACTION ROUTES =================

// Create booking (Includes distributed locking and ACID payment rollbacks)
router.post('/bookings', authenticateToken, async (req, res) => {
  const { scheduleId, seats, amount, paymentDetails, simulateFailure } = req.body;
  const userId = req.user.id;

  if (!scheduleId || !seats || !Array.isArray(seats) || seats.length === 0 || !amount) {
    return res.status(400).json({ error: 'Missing booking details.' });
  }

  // 1. Double Booking Check (static state check)
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule slot not found.' });
  }

  const conflicts = seats.filter(seat => schedule.occupiedSeats.includes(seat));
  if (conflicts.length > 0) {
    return res.status(400).json({ error: `Seats: [${conflicts.join(', ')}] are already occupied.` });
  }

  // 2. Acquire Distributed Locks for target seats
  try {
    await acquireSeatLocks(scheduleId, seats, userId);
  } catch (lockError) {
    return res.status(409).json({ error: lockError.message });
  }

  // 3. Simulated Payment Validation & Processing
  try {
    if (paymentDetails.method === 'card') {
      const { cardNumber, expiry, cvc, name } = paymentDetails;
      if (!cardNumber || !expiry || !cvc || !name) {
        throw new Error('Incomplete credit card details.');
      }
      // Simple credit card validations
      if (cardNumber.replace(/\s/g, '').length !== 16) {
        throw new Error('Invalid Card Number format.');
      }
      if (cvc.length !== 3) {
        throw new Error('Invalid CVV/CVC format.');
      }
    }

    // Explicit request mock failure for ACID rollback demonstration
    if (simulateFailure) {
      throw new Error('Simulated Payment Gateway failure. Transaction aborted.');
    }

    // 4. ACID Compliance: Commit occupied seats to schedule and save booking
    schedule.occupiedSeats.push(...seats);
    await schedule.save();

    // QR Code API generation link
    const qrData = encodeURIComponent(`Booking:${scheduleId}:${seats.join(',')}:${userId}`);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;

    const booking = await Booking.create({
      userId,
      scheduleId,
      seats,
      amount,
      status: 'active',
      qrCodeUrl
    });

    // 5. Clean up locks
    await releaseSeatLocks(scheduleId, seats, userId);

    res.status(201).json({
      message: 'Booking completed successfully!',
      booking
    });

  } catch (paymentOrCommitError) {
    // 6. Rollback! Payment failed or commit failed -> release seat locks immediately
    await releaseSeatLocks(scheduleId, seats, userId);

    return res.status(400).json({
      error: paymentOrCommitError.message || 'Payment processing failed. Your temporary reservation has been released.'
    });
  }
});

// Fetch active and past bookings for logged in user
router.get('/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'scheduleId',
        populate: [
          { path: 'movieId' },
          { path: 'theatreId' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
});

// Cancel active booking
router.post('/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking record not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'This booking is already cancelled.' });
    }

    // Find schedule and release seats
    const schedule = await Schedule.findById(booking.scheduleId);
    if (schedule) {
      schedule.occupiedSeats = schedule.occupiedSeats.filter(
        seat => !booking.seats.includes(seat)
      );
      await schedule.save();
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully. Seats are now available.',
      booking
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

export default router;
