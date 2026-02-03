const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hotel name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  images: [{
    type: String
  }],
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  amenities: [{
    type: String
  }],
  roomTypes: [{
    type: String
  }],
  totalRooms: {
    type: Number,
    default: 1
  },
  availableRooms: {
    type: Number,
    default: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);
