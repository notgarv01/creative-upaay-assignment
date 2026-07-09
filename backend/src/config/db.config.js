import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from '../services/seed.service.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDB() {
  if (!MONGODB_URI) {
    console.error('FATAL: MONGODB_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');
    // Automatically seed data if needed
    await seedDatabase();
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
