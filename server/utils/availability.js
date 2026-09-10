import Order from '../models/Order.js';

// Orders in these statuses hold their assigned units for the duration of
// their date range. A 'cancelled' order releases its units immediately.
const BLOCKING_STATUSES = ['pending', 'approved', 'completed'];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateRange(startDate, endDate) {
  return (
    typeof startDate === 'string' &&
    typeof endDate === 'string' &&
    DATE_RE.test(startDate) &&
    DATE_RE.test(endDate) &&
    startDate <= endDate // ISO "YYYY-MM-DD" strings compare correctly lexicographically
  );
}

// Server-local calendar date as "YYYY-MM-DD", computed the same way as the
// client's "today" check — a plain UTC toISOString() would read a day behind
// local time for part of the day in timezones ahead of UTC.
export function todayIso() {
  const now = new Date();
  const localMidnight = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localMidnight.toISOString().slice(0, 10);
}

export function rentalDays(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
}

// Returns the sorted list of unit numbers (1..stockTotal) that are NOT
// already reserved by another order overlapping [startDate, endDate].
export async function findFreeUnits(productId, stockTotal, startDate, endDate, excludeOrderId = null) {
  const query = {
    productId,
    status: { $in: BLOCKING_STATUSES },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };
  if (excludeOrderId) query._id = { $ne: excludeOrderId };

  const overlapping = await Order.find(query).select('unitNumbers');
  const taken = new Set();
  overlapping.forEach((order) => order.unitNumbers.forEach((n) => taken.add(n)));

  const free = [];
  for (let unit = 1; unit <= stockTotal; unit += 1) {
    if (!taken.has(unit)) free.push(unit);
  }
  return free;
}
