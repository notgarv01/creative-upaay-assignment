import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Schedule, User, SeatLock, Booking, Movie, Theatre } from './models.js';
import { seedDatabase } from './seed.js';

const MONGODB_URI = 'mongodb://localhost:27017/movie_booking';

async function runAcidTest() {
  console.log('--- START ACID COMPLIANCE TEST ---');
  
  // 1. Connect to DB
  await mongoose.connect(MONGODB_URI);
  
  // Force clear to trigger fresh seed
  await Movie.deleteMany({});
  await Theatre.deleteMany({});
  await Schedule.deleteMany({});
  await seedDatabase();

  // Find a schedule
  const schedule = await Schedule.findOne({ date: 'Fri 10', screen: 'Screen 1' });
  if (!schedule) {
    console.error('Test failed: Schedule not found.');
    process.exit(1);
  }

  // Clear existing logs
  await Booking.deleteMany({ scheduleId: schedule._id });
  await SeatLock.deleteMany({ scheduleId: schedule._id });
  schedule.occupiedSeats = [];
  await schedule.save();

  // Create test user
  const userEmail = `acid_test_${Date.now()}@test.com`;
  const user = await User.create({ name: 'Acid Test User', email: userEmail, password: 'password' });

  // Generate token
  const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, 'secret-key-12345');

  const testSeats = ['C-1', 'C-2'];

  console.log(`Sending booking request with simulateFailure: true for seats [${testSeats.join(', ')}]...`);

  // Call booking endpoint with failure flag enabled
  const res = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      scheduleId: schedule._id.toString(),
      seats: testSeats,
      amount: 580,
      paymentDetails: {
        method: 'card',
        name: 'Acid Test User',
        cardNumber: '1111222233334444',
        expiry: '12/28',
        cvc: '123'
      },
      simulateFailure: true // <-- Triggers transaction rollback in backend
    })
  });

  const data = await res.json();
  console.log(`Response Status: ${res.status}`);
  console.log('Response Body:', data);

  // Assertions:
  // 1. Response status must be 400
  const isCorrectStatus = res.status === 400;

  // 2. Schedule's occupied seats should NOT contain target seats
  const updatedSchedule = await Schedule.findById(schedule._id);
  const seatsWereNotBooked = testSeats.every(s => !updatedSchedule.occupiedSeats.includes(s));

  // 3. No Booking record should be created
  const bookingExists = await Booking.findOne({ scheduleId: schedule._id, userId: user._id });
  const noBookingRecord = !bookingExists;

  // 4. Temporary seat locks must be empty
  const locksCount = await SeatLock.countDocuments({ scheduleId: schedule._id });
  const locksWereReleased = locksCount === 0;

  console.log('\n--- ACID Validation Checks ---');
  console.log(`1. Correct Error Status (400): ${isCorrectStatus ? 'PASSED' : 'FAILED'}`);
  console.log(`2. Seats Reverted to Available: ${seatsWereNotBooked ? 'PASSED' : 'FAILED'}`);
  console.log(`3. No Booking Saved in Database: ${noBookingRecord ? 'PASSED' : 'FAILED'}`);
  console.log(`4. Seat Locks Released: ${locksWereReleased ? 'PASSED' : 'FAILED'}`);

  const testPassed = isCorrectStatus && seatsWereNotBooked && noBookingRecord && locksWereReleased;

  if (testPassed) {
    console.log('\n✅ SUCCESS: ACID transaction test passed. Failure triggers rollback, releasing all seat reservations.');
  } else {
    console.error('\n❌ FAILURE: ACID transaction test failed. Data left inconsistent.');
  }

  // Cleanup
  await User.deleteOne({ _id: user._id });
  await mongoose.disconnect();
  process.exit(testPassed ? 0 : 1);
}

runAcidTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
