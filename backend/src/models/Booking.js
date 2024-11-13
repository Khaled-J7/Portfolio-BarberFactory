const mongoose = require('mongoose');

/**
 * Booking Schema
 * Handles appointments between clients and barbershops
 * Supports both client bookings and barber self-bookings
 */
const bookingSchema = new mongoose.Schema({
  // Client who made the booking (can be a regular client or a barber)
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The shop where the booking is made
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

// Create indexes for frequently queried fields
bookingSchema.index({ shop: 1, date: 1, status: 1 });
bookingSchema.index({ client: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);