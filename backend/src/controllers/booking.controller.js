import mongoose from 'mongoose';
import { Schedule } from '../models/Schedule.model.js';
import { Booking } from '../models/Booking.model.js';
import { acquireSeatLocks, releaseSeatLocks } from '../services/lock.service.js';

// Get schedules handler
export async function getSchedules(req, res) {
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
}

// Create booking (Includes distributed locking and ACID payment rollbacks)
export async function createBooking(req, res) {
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
      const parts = expiry.split('/');
      if (parts.length !== 2) {
        throw new Error('Expiry date must be MM/YY format.');
      }
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10);
      if (isNaN(month) || month < 1 || month > 12) {
        throw new Error('Please enter a valid month (01-12).');
      }
      if (isNaN(year) || parts[1].length !== 2) {
        throw new Error('Please enter a valid 2-digit year (YY).');
      }
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        throw new Error('Expiry date must be in the future.');
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
}

// Fetch active and past bookings for logged in user
export async function getBookings(req, res) {
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
}

// Cancel active booking
export async function cancelBooking(req, res) {
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
}
