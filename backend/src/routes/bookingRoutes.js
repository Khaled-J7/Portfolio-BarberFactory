/**
 * Booking Routes
 * Defines API endpoints for booking management
 */
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes with authentication
router.use(authMiddleware);

/**
 * POST /api/booking/create
 * Create a new booking
 * @body {Object} bookingData (shopId, date, time)
 */
router.post('/create', bookingController.createBooking);

/**
 * GET /api/booking/all
 * Get all bookings for the user
 * - For barbers: Returns both personal bookings and shop bookings
 * - For clients: Returns only their bookings
 */
router.get('/all', bookingController.getBookings);

/**
 * PUT /api/booking/status
 * Update booking status (confirm/decline)
 * Only accessible by shop owners
 * @body {Object} statusData (bookingId, status)
 */
router.put('/status', bookingController.updateBookingStatus);

module.exports = router;