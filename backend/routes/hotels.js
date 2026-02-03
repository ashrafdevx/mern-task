const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// @route   GET /api/hotels
// @desc    Get all available hotels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, minPrice, maxPrice, rating } = req.query;
    
    // Build filter object
    let filter = { isAvailable: true };
    
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }
    
    const hotels = await Hotel.find(filter)
      .select('-__v')
      .sort({ rating: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get single hotel by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).select('-__v');
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel',
      error: error.message
    });
  }
});

module.exports = router;
