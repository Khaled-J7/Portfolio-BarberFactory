/**
 * Booking Service
 * Handles all API calls related to bookings
 */
const API_URL = 'https://barber-factory-api.onrender.com/api';

const bookingService = {
    /**
     * Create a new booking
     * @param {Object} bookingData - Booking information
     * @param {string} bookingData.shopId - ID of the shop
     * @param {string} bookingData.date - Date of the booking
     * @param {string} bookingData.time - Time slot
     * @param {string} token - User's authentication token
     */
    createBooking: async (bookingData, token) => {
        try {
            console.log('Creating booking with data:', bookingData);
            const response = await fetch(`${API_URL}/booking/create`, { // Add backticks for template literal
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Wrap in backticks for template literal
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create booking');
            }

            return data;
        } catch (error) {
            console.error('Create booking error:', error);
            throw error;
        }
    },

    /**
     * Get all bookings for the user
     * Returns different data based on user type (client/barber)
     * @param {string} token - User's authentication token
     */
    getBookings: async (token) => {
        try {
            const response = await fetch(`${API_URL}/booking/all`, { // Add backticks for template literal
                headers: {
                    'Authorization': `Bearer ${token}` // Wrap in backticks for template literal
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

            // For clients: data.myBookings
            // For barbers: data.myBookings + data.shopBookings
            return data;
        } catch (error) {
            console.error('Get bookings error:', error);
            throw error;
        }
    },

    /**
     * Update booking status (Confirm/Decline)
     * Only for barbers to manage their shop's bookings
     * @param {Object} statusData - Status update information
     * @param {string} statusData.bookingId - ID of the booking to update
     * @param {string} statusData.status - New status ('CONFIRMED' or 'DECLINED')
     * @param {string} token - User's authentication token
     */
    updateBookingStatus: async (statusData, token) => {
        try {
            console.log('Updating booking status:', statusData);
            const response = await fetch(`${API_URL}/booking/status`, { // Add backticks for template literal
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Wrap in backticks for template literal
                },
                body: JSON.stringify(statusData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update booking status');
            }

            return data;
        } catch (error) {
            console.error('Update booking status error:', error);
            throw error;
        }
    },

    /**
     * Helper function to format date for display
     * @param {Date} date - Date object to format
     * @returns {string} Formatted date string
     */
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Helper function to format time for display
     * @param {string} time - Time string to format
     * @returns {string} Formatted time string
     */
    formatTime: (time) => {
        // Assuming time is in 24-hour format (e.g., "14:00")
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { // Add backticks for template literal
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }
};

export default bookingService;
