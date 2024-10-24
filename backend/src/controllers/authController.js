const User = require('../models/User');

// JWTs are used to securely transmit information between the client and server, typically for authentication.
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'    // the user needs to log in again after 30 days to get a new token
  });
};

const authController = {
  // Register new user
  register: async (req, res) => {
    try {
      const { fullName, phoneNumber, password } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ phoneNumber });
      if (userExists) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }

      // Create new user
      const user = await User.create({
        fullName,
        phoneNumber,
        password
      });

      // Generate token
      const token = generateToken(user._id);

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
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;

      // Find user
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id);

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
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;