import express from 'express';
import { getSchedules } from '../controllers/booking.controller.js';

const router = express.Router();

router.get('/', getSchedules);

export default router;
