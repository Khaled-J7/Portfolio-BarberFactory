/**
 * Booking Service
 * Handles all booking-related API calls
 */
const API_URL = 'https://barber-factory-api.onrender.com/api';

const bookingService = {
    /**
     * Create a new booking (clients only)
     */
    createBooking: async (bookingData, token) => {
        try {
            const response = await fetch(`${API_URL}/booking/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
     * Get bookings based on user type
     * Clients: Get their bookings
     * Barbers: Get bookings for their shop
     */
    getBookings: async (token) => {
        try {
            const response = await fetch(`${API_URL}/booking/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

            return data;
        } catch (error) {
            console.error('Get bookings error:', error);
            throw error;
        }
    },

    /**
     * Update booking status (barbers only)
     */
    updateBookingStatus: async (statusData, token) => {
        try {
            const response = await fetch(`${API_URL}/booking/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
     * Format date for display
     */
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Format time for display
     */
    formatTime: (time) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }
};

export default bookingService;