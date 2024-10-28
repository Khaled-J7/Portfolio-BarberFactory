const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  register: async (req, res) => {
    try {
      console.log('Starting registration process...');
      console.log('Received data:', { ...req.body, password: '[HIDDEN]' });

      const { fullName, phoneNumber, password } = req.body;

      console.log('Checking if user exists...');
      const userExists = await User.findOne({ phoneNumber });
      
      if (userExists) {
        console.log('User already exists with phone number:', phoneNumber);
        return res.status(400).json({ message: 'Phone number already registered' });
      }

      console.log('Creating new user...');
      const user = new User({
        fullName,
        phoneNumber,
        password
      });

      console.log('Saving user to database...');
      await user.save();
      console.log('User saved successfully:', { id: user._id, phoneNumber });

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
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

module.exports = authController;