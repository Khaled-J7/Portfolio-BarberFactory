const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect all routes
router.use(authMiddleware);

/**
 * POST /api/booking/create
 * Create a new booking (clients only)
 */
router.post('/create', bookingController.createBooking);

/**
 * GET /api/booking/all
 * Get bookings based on user type:
 * - Clients: Get their bookings
 * - Barbers: Get bookings for their shop
 */
router.get('/all', bookingController.getBookings);

/**
 * PUT /api/booking/status
 * Update booking status (barbers only)
 */
router.put('/status', bookingController.updateBookingStatus);

module.exports = router;