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
     * Only clients can create bookings
     */
    createBooking: async (req, res) => {
        try {
            const { shopId, date, time } = req.body;
            const clientId = req.user.id;

            // Verify user is a client
            const client = await User.findById(clientId);
            if (!client || client.isBarber) {
                return res.status(403).json({ 
                    message: 'Only clients can create bookings' 
                });
            }

            // Verify shop exists
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return res.status(404).json({ 
                    message: 'Shop not found' 
                });
            }

            // Check if timeslot is available
            const existingBooking = await Booking.findOne({
                shop: shopId,
                date: new Date(date),
                time,
                status: { $in: ['PENDING', 'CONFIRMED'] }
            });

            if (existingBooking) {
                return res.status(400).json({ 
                    message: 'Time slot not available' 
                });
            }

            // Create booking
            const booking = await Booking.create({
                client: clientId,
                shop: shopId,
                clientName: client.fullName,
                shopName: shop.name,
                date: new Date(date),
                time,
                status: 'PENDING'
            });

            res.status(201).json(booking);
        } catch (error) {
            console.error('Create booking error:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    /**
     * Get bookings based on user type
     * Clients: Get their bookings
     * Barbers: Get bookings for their shop
     */
    getBookings: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);

            if (user.isBarber) {
                // Get bookings for barber's shop
                const shop = await Shop.findOne({ owner: userId });
                if (!shop) {
                    return res.status(404).json({ 
                        message: 'Shop not found' 
                    });
                }

                const bookings = await Booking.find({ shop: shop._id })
                    .sort({ date: 1, time: 1 })
                    .populate('client', 'fullName phoneNumber');

                res.json(bookings);
            } else {
                // Get client's bookings
                const bookings = await Booking.find({ client: userId })
                    .sort({ date: -1, time: 1 })
                    .populate('shop', 'name address phone');

                res.json(bookings);
            }
        } catch (error) {
            console.error('Get bookings error:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    },

    /**
     * Update booking status
     * Only shop owners can update booking status
     */
    updateBookingStatus: async (req, res) => {
        try {
            const { bookingId, status } = req.body;
            
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ 
                    message: 'Booking not found' 
                });
            }

            // Verify the shop owner
            const shop = await Shop.findById(booking.shop);
            if (!shop || shop.owner.toString() !== req.user.id) {
                return res.status(403).json({ 
                    message: 'Not authorized to update this booking' 
                });
            }

            booking.status = status;
            await booking.save();

            res.json(booking);
        } catch (error) {
            console.error('Update booking status error:', error);
            res.status(500).json({ 
                message: 'Server error', 
                error: error.message 
            });
        }
    }
};

module.exports = bookingController;