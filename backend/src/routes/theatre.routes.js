import express from 'express';
import { getTheatres } from '../controllers/theatre.controller.js';

const router = express.Router();

router.get('/', getTheatres);

export default router;
