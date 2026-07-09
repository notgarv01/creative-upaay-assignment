import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.config.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Establish database connection and listen for HTTP traffic
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
