const Booking = require('../models/Booking');
const Shop = require('../models/Shop');
const User = require('../models/User');

/**
 * Booking Controller
 * Handles all booking-related operations
 */
const bookingController = {
    /**
     * Create a new booking
     * Can be used by both clients and barbers
     */
    createBooking: async (req, res) => {
        try {
            const { shopId, date, time } = req.body;
            const clientId = req.user.id; // From auth middleware

            // Verify shop exists
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            // Get client details
            const client = await User.findById(clientId);
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }

            // Check if timeslot is available
            const existingBooking = await Booking.findOne({
                shop: shopId,
                date: new Date(date),
                time,
                status: { $in: ['PENDING', 'CONFIRMED'] }
            });

            if (existingBooking) {
                return res.status(400).json({ message: 'Time slot not available' });
            }

            // Create the booking
            const booking = await Booking.create({
                client: clientId,
                shop: shopId,
                clientName: client.fullName,
                shopName: shop.name,
                date: new Date(date),
                time,
                status: 'PENDING'
            });

            console.log('New booking created:', booking);
            res.status(201).json(booking);
        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    /**
     * Get bookings for the current user
     * For barbers: Returns both their shop's bookings and their personal bookings
     * For clients: Returns only their bookings
     */
    getBookings: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);

            let response = {
                myBookings: [], // Bookings made by the user
                shopBookings: [] // Only for barbers: bookings at their shop
            };

            // Get user's personal bookings (both clients and barbers)
            response.myBookings = await Booking.find({ client: userId })
                .sort({ date: -1 })
                .populate('shop', 'name address');

            // If user is a barber, get their shop's bookings
            if (user.isBarber) {
                const shop = await Shop.findOne({ owner: userId });
                if (shop) {
                    response.shopBookings = await Booking.find({ shop: shop._id })
                        .sort({ date: 1 })
                        .populate('client', 'fullName phoneNumber');
                }
            }

            res.json(response);
        } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    /**
     * Update booking status (Confirm/Decline)
     * Only the shop owner can update booking status
     */
    updateBookingStatus: async (req, res) => {
        try {
            const { bookingId, status } = req.body;
            
            // Find the booking
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Verify the user owns the shop
            const shop = await Shop.findById(booking.shop);
            if (!shop || shop.owner.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this booking' });
            }

            // Update status
            booking.status = status;
            await booking.save();

            console.log(`Booking ${bookingId} status updated to ${status}`);
            res.json(booking);
        } catch (error) {
            console.error('Update booking status error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
};

module.exports = bookingController;