// Define the base URL for your API
// During development with a local backend, this might be something like:
// - For Android Emulator: 'http://10.0.2.2:5000/api'
// - For iOS Simulator: 'http://localhost:5000/api'
// - For physical device: 'http://computer-ip:5000/api'

const API_URL = 'http://192.168.100.203:5000/api';

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.fullName - User's full name
   * @param {string} userData.phoneNumber - User's phone number
   * @param {string} userData.password - User's password
   * @returns {Promise} Response from the server containing user data and token
   */
  register: async (userData) => {
    try {
      // Make POST request to register endpoint
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Parse the JSON response
      const data = await response.json();

      // If response is not ok, throw error with message from server
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // If successful, return the data
      return data; // Contains { token, user } from your backend
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login an existing user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.phoneNumber - User's phone number
   * @param {string} credentials.password - User's password
   * @returns {Promise} Response from the server containing user data and token
   */
  login: async (credentials) => {
    try {
      // Make POST request to login endpoint
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Parse the JSON response
      const data = await response.json();

      // If response is not ok, throw error with message from server
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // If successful, return the data
      return data; // Contains { token, user } from your backend
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Example of how the response data will look
   * {
   *   token: "your-jwt-token",
   *   user: {
   *     id: "user-id",
   *     fullName: "User Name",
   *     phoneNumber: "1234567890",
   *     isBarber: false
   *   }
   * }
   */
};


export default authService;