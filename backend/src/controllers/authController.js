/**
 * Authentication Controller
 * Handles user registration and login functionality
 */

const Shop = require('../models/Shop');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for a user
 * @param {string} userId - The user's MongoDB _id
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const authController = {
  /**
   * User Registration
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing user data
   * @param {string} req.body.fullName - User's full name
   * @param {string} req.body.phoneNumber - User's phone number
   * @param {string} req.body.password - User's password
   * @param {Object} res - Express response object
   */
  register: async (req, res) => {
    try {
      const { fullName, phoneNumber, password, isBarber } = req.body;

      // DEBUG: Log registration attempt
      console.log('Registration attempt:', { fullName, phoneNumber, isBarber  });

      // Check for existing user
      const userExists = await User.findOne({ phoneNumber });
      if (userExists) {
        // DEBUG: Log duplicate user attempt
        console.log('Registration failed: Phone number already exists');
        return res.status(400).json({ message: 'Phone number already registered' });
      }

      // Create new user
      const user = await User.create({
        fullName,
        phoneNumber,
        password, // Will be hashed by mongoose pre-save middleware
        isBarber: Boolean(isBarber) // To ensure Boolean value 
      });

      // Generate token
      const token = generateToken(user._id);

      // DEBUG: Log successful registration
      console.log('User registered successfully:', user._id, 'isBarber:', user.isBarber);

      // Send response
      res.status(201).json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          isBarber: user.isBarber
        }
      });
    } catch (error) {
      // DEBUG: Log registration error
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  /**
   * User Login
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing credentials
   * @param {string} req.body.phoneNumber - User's phone number
   * @param {string} req.body.password - User's password
   * @param {Object} res - Express response object
   */
  login: async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;

      // DEBUG: Log login attempt
      console.log('Login attempt for:', phoneNumber);

      // Find user
      const user = await User.findOne({ phoneNumber });
      
      // Check if user exists
      if (!user) {
        // DEBUG: Log user not found
        console.log('Login failed: User not found');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        // DEBUG: Log invalid password
        console.log('Login failed: Invalid password');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

      // DEBUG: Log successful login
      console.log('Login successful for user:', user._id);

      // Send response
      res.json({
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          isBarber: user.isBarber
        }
      });
    } catch (error) {
      // DEBUG: Log login error
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Add delete controller method
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user.id; // From auth middleware
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // If user is a barber, delete their shop profile first
      if (user.isBarber) {
        const shop = await Shop.findOneAndDelete({ owner: userId });
        console.log('Deleted shop profile:', shop ? 'Yes' : 'No');
      }
  
      // Delete user account
      await User.findByIdAndDelete(userId);
      console.log('User account deleted');
  
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Error deleting account' });
    }
  }
};

module.exports = authController;