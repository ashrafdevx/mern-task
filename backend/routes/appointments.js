const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Hotel = require('../models/Hotel');

// @route   POST /api/appointments
// @desc    Create a new appointment/booking
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      hotelId,
      guestName,
      email,
      phone,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      roomType,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!hotelId || !guestName || !email || !phone || !checkInDate || !checkOutDate || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check availability
    if (!hotel.isAvailable || hotel.availableRooms < 1) {
      return res.status(400).json({
        success: false,
        message: 'No rooms available at this hotel'
      });
    }

    // Calculate total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.pricePerNight;

    // Create appointment
    const appointment = new Appointment({
      hotelId,
      guestName,
      email,
      phone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      roomType: roomType || 'Standard',
      specialRequests: specialRequests || '',
      totalPrice,
      status: 'pending'
    });

    await appointment.save();

    // Update available rooms
    hotel.availableRooms -= 1;
    await hotel.save();

    // Populate hotel details in response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('hotelId', 'name location pricePerNight')
      .select('-__v');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedAppointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// @route   GET /api/appointments
// @desc    Get all appointments (for admin)
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('hotelId', 'name location')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// @route   GET /api/appointments/:id
// @desc    Get single appointment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('hotelId', 'name location pricePerNight image')
      .select('-__v');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
});

module.exports = router;
