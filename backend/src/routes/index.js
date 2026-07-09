import express from 'express';
import authRoutes from './auth.routes.js';
import movieRoutes from './movie.routes.js';
import theatreRoutes from './theatre.routes.js';
import scheduleRoutes from './schedule.routes.js';
import bookingRoutes from './booking.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/theatres', theatreRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/bookings', bookingRoutes);

export default router;
