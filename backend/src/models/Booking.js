const mongoose = require('mongoose');

/**
 * Booking Schema
 * Handles appointment bookings between clients and barbershops
 * Only clients can create bookings
 */
const bookingSchema = new mongoose.Schema({
    // Client who made the booking (must be a non-barber user)
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The shop being booked
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    // Store names directly to avoid extra queries
    clientName: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    // Booking details
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'DECLINED'],
        default: 'PENDING'
    }
}, { 
    timestamps: true 
});

// Indexes for efficient queries
bookingSchema.index({ shop: 1, date: 1 });
bookingSchema.index({ client: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);