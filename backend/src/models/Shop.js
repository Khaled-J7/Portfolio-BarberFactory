const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // One shop per barber
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  coverImage: {
    type: String,
    required: true
  },
  galleryImages: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);