import { SeatLock } from './models.js';

/**
 * Attempts to acquire locks for all requested seats.
 * If any seat is already locked, it rolls back all other locks acquired in this transaction.
 */
export async function acquireSeatLocks(scheduleId, seats, userId) {
  const lockedSeats = [];
  try {
    for (const seat of seats) {
      // Try to create the lock. The compound unique index on { scheduleId, seat } will throw an error on conflict.
      await SeatLock.create({ scheduleId, seat, userId });
      lockedSeats.push(seat);
    }
    return true;
  } catch (error) {
    // Rollback locks acquired so far
    if (lockedSeats.length > 0) {
      await SeatLock.deleteMany({
        scheduleId,
        userId,
        seat: { $in: lockedSeats }
      });
    }
    throw new Error('One or more seats are currently locked by another customer. Please choose different seats.');
  }
}

/**
 * Releases locks for specified seats.
 */
export async function releaseSeatLocks(scheduleId, seats, userId) {
  try {
    await SeatLock.deleteMany({
      scheduleId,
      userId,
      seat: { $in: seats }
    });
    return true;
  } catch (error) {
    console.error('Error releasing seat locks:', error);
    return false;
  }
}
