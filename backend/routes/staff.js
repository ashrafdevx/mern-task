const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// @route   GET /api/staff
// @desc    Get all active staff members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const staff = await Staff.find({ isActive: true })
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff members',
      error: error.message
    });
  }
});

// @route   GET /api/staff/:id
// @desc    Get single staff member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select('-__v');
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff member',
      error: error.message
    });
  }
});

module.exports = router;
