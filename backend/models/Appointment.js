const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel ID is required']
  },
  guestName: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  checkInDate: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: 1
  },
  roomType: {
    type: String,
    default: 'Standard'
  },
  specialRequests: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Validate check-out date is after check-in date
appointmentSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    const error = new Error('Check-out date must be after check-in date');
    next(error);
  }
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
