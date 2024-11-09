const User = require('../models/User');

const clientController = {
  // Get client profile
  getProfile: async (req, res) => {
    try {
      const clientProfile = await User.findById(req.user.id)
        .select('-password'); // Exclude password
      
      if (!clientProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json(clientProfile);
    } catch (error) {
      console.error('Get client profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update client profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, phoneNumber, profileImage } = req.body;

      // Build update object
      const updateFields = {};
      if (fullName) updateFields.fullName = fullName;
      if (phoneNumber) updateFields.phoneNumber = phoneNumber;
      if (profileImage) updateFields.profileImage = profileImage;

      // Find and update profile
      const updatedProfile = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true }
      ).select('-password');

      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json(updatedProfile);
    } catch (error) {
      console.error('Update client profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = clientController;