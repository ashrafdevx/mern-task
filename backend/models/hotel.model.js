const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-+()]{10,15}$/;

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      unique: true,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    availableRooms: {
      type: Number,
      default: 0,
      min: [0, 'Available rooms cannot be negative'],
    },
    totalRooms: {
      type: Number,
      default: 0,
      min: [0, 'Total rooms cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: {
        values: ['budget', 'standard', 'luxury'],
        message: 'Category must be budget, standard, or luxury',
      },
      default: 'standard',
    },
    contactEmail: {
      type: String,
      validate: {
        validator: (v) => !v || emailRegex.test(v),
        message: 'Invalid email format',
      },
    },
    contactPhone: {
      type: String,
      validate: {
        validator: (v) => !v || phoneRegex.test(v),
        message: 'Invalid phone format',
      },
    },
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
  },
  {
    timestamps: true,
  }
);

hotelSchema.index({ location: 1 });
hotelSchema.index({ isAvailable: 1 });
hotelSchema.index({ price: 1 });
hotelSchema.index({ rating: -1 });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = { Hotel };
