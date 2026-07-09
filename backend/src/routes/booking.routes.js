import express from 'express';
import { createBooking, getBookings, cancelBooking } from '../controllers/booking.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.post('/:id/cancel', authenticateToken, cancelBooking);

export default router;
