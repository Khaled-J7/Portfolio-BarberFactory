const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  login: async (req, res) => {
    try {
      const { phoneNumber, password } = req.body;
      console.log('Login attempt for:', phoneNumber); // Debug log

      // Find user
      const user = await User.findOne({ phoneNumber });
      console.log('User found:', user ? 'Yes' : 'No'); // Debug log

      if (!user) {
        console.log('No user found with this phone number');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch ? 'Yes' : 'No'); // Debug log

      if (!isMatch) {
        console.log('Password does not match');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      console.log('Login successful for user:', user.fullName); // Debug log

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
      console.error('Login error:', error); // Debug log
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  register: async (req, res) => {
    try {
      console.log('Register attempt with data:', req.body); // Debug log

      const { fullName, phoneNumber, password } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ phoneNumber });
      if (userExists) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }

      // Create new user
      const user = await User.create({
        fullName,
        phoneNumber,
        password // This will be hashed by the pre-save middleware
      });

      console.log('User created successfully:', user.fullName); // Debug log

      // Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

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
      console.error('Registration error:', error); // Debug log
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;