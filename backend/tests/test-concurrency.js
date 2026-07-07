import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Schedule, User, SeatLock, Booking, Movie, Theatre } from '../models.js';
import { seedDatabase } from '../seed.js';

const MONGODB_URI = 'mongodb://localhost:27017/movie_booking';

async function runConcurrencyTest() {
  console.log('--- START CONCURRENCY LOCK TEST ---');
  
  // 1. Connect to DB
  await mongoose.connect(MONGODB_URI);
  
  // Force clear to trigger a fresh seed
  await Movie.deleteMany({});
  await Theatre.deleteMany({});
  await Schedule.deleteMany({});
  await seedDatabase();

  // Find a schedule
  const schedule = await Schedule.findOne({ date: 'Fri 10', screen: 'Screen 1' });
  if (!schedule) {
    console.error('Test failed: Schedule not found. Ensure DB is seeded.');
    process.exit(1);
  }

  // Clear any existing locks/bookings for this schedule to ensure a clean test run
  await SeatLock.deleteMany({ scheduleId: schedule._id });
  await Booking.deleteMany({ scheduleId: schedule._id });
  // Clean occupied seats list for the test target
  schedule.occupiedSeats = [];
  await schedule.save();

  // Create two distinct test users in DB
  const user1Email = `user1_${Date.now()}@test.com`;
  const user2Email = `user2_${Date.now()}@test.com`;

  const user1 = await User.create({ name: 'User One', email: user1Email, password: 'password' });
  const user2 = await User.create({ name: 'User Two', email: user2Email, password: 'password' });

  // Generate tokens
  const token1 = jwt.sign({ id: user1._id, email: user1.email, name: user1.name }, 'secret-key-12345');
  const token2 = jwt.sign({ id: user2._id, email: user2.email, name: user2.name }, 'secret-key-12345');

  // Seats to compete for
  const targetSeats = ['B-5', 'B-6'];

  console.log(`User 1 & User 2 competing for seats [${targetSeats.join(', ')}] on schedule ${schedule._id}`);

  // Perform parallel booking API calls
  const request1 = fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token1}`
    },
    body: JSON.stringify({
      scheduleId: schedule._id.toString(),
      seats: targetSeats,
      amount: 580,
      paymentDetails: {
        method: 'card',
        name: 'User One',
        cardNumber: '1111222233334444',
        expiry: '12/28',
        cvc: '123'
      }
    })
  });

  const request2 = fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token2}`
    },
    body: JSON.stringify({
      scheduleId: schedule._id.toString(),
      seats: targetSeats,
      amount: 580,
      paymentDetails: {
        method: 'card',
        name: 'User Two',
        cardNumber: '5555666677778888',
        expiry: '10/27',
        cvc: '456'
      }
    })
  });

  console.log('Sending parallel booking requests...');
  
  const [res1, res2] = await Promise.all([request1, request2]);
  
  const data1 = await res1.json();
  const data2 = await res2.json();

  console.log('\n--- Test Result Summary ---');
  console.log(`User 1 Response Status: ${res1.status}`, data1);
  console.log(`User 2 Response Status: ${res2.status}`, data2);

  // Assertion: One request must return 201 (Created) and the other must return 409 (Conflict) or 400 (Double Booking)
  const isOneSuccess = (res1.status === 201 && (res2.status === 409 || res2.status === 400)) ||
                       (res2.status === 201 && (res1.status === 409 || res1.status === 400));

  if (isOneSuccess) {
    console.log('\n✅ SUCCESS: Concurrency lock test passed. One user booked successfully and duplicate concurrent attempt was blocked.');
  } else {
    console.error('\n❌ FAILURE: Concurrency lock test failed. Double booking might have occurred or response codes did not match expectations.');
  }

  // Cleanup test users
  await User.deleteOne({ _id: user1._id });
  await User.deleteOne({ _id: user2._id });
  
  await mongoose.disconnect();
  process.exit(isOneSuccess ? 0 : 1);
}

runConcurrencyTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
