/**
 * Authentication Service
 * Handles all API calls related to authentication
 */

// Production API URL from Render.com deployment
const API_URL = 'https://barber-factory-api.onrender.com/api';

const authService = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.phoneNumber - User's phone number
   * @param {string} userData.password - User's password
   * @returns {Promise<Object>} Response containing token and user data
   */
  register: async (userData) => {
    try {
      // DEBUG: Log registration request
      console.log('Starting registration request to:', `${API_URL}/auth/register`);
      console.log('With data:', userData);

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // DEBUG: Log response status
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      // DEBUG: Log registration error
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.phoneNumber - User's phone number
   * @param {string} credentials.password - User's password
   * @returns {Promise<Object>} Response containing token and user data
   */
  login: async (credentials) => {
    try {
      // DEBUG: Log login request
      console.log('Starting login request to:', `${API_URL}/auth/login`);
      console.log('With credentials:', { ...credentials, password: '***' }); // Hide password in logs

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // DEBUG: Log response status
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      // DEBUG: Log login error
      console.error('Login error:', error);
      throw error;
    }
  },

  // Delete Account
  deleteAccount: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
};

export default authService;