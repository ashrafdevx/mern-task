const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-+()]{10,15}$/;

const appointmentSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => emailRegex.test(v),
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: (v) => phoneRegex.test(v),
        message: 'Phone must be 10-15 digits',
      },
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
    },
    hotelName: {
      type: String,
      required: [true, 'Hotel name is required'],
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest required'],
      max: [20, 'Maximum 20 guests'],
    },
    rooms: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 room required'],
    },
    totalPrice: {
      type: Number,
    },
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed'],
        message: 'Invalid status',
      },
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'refunded'],
        message: 'Invalid payment status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ email: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ checkInDate: 1 });

appointmentSchema.pre('validate', function (next) {
  if (this.checkInDate && this.checkOutDate && this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  } else {
    next();
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = { Appointment };
