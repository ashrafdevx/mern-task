const express = require('express');
const { body, param } = require('express-validator');
const { checkDBMiddleware } = require('../middleware/fallback.middleware');
const { runValidation } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../utils/asyncHandler.util');
const appointmentController = require('../controllers/appointment.controller');

const router = express.Router();

router.use(checkDBMiddleware);

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').matches(/^[\d\s\-+()]{10,15}$/).withMessage('Valid phone (10-15 digits) required'),
    body('hotelName').trim().notEmpty().withMessage('Hotel name is required'),
    body('checkInDate').isISO8601().withMessage('Valid check-in date required'),
    body('checkOutDate').isISO8601().withMessage('Valid check-out date required'),
    body('guests').isInt({ min: 1, max: 20 }).withMessage('Guests must be 1-20'),
    body('rooms').optional().isInt({ min: 1 }).withMessage('Rooms must be at least 1'),
    body('specialRequests').optional().isLength({ max: 500 }).withMessage('Max 500 characters'),
  ],
  runValidation,
  asyncHandler(appointmentController.createAppointment)
);

router.get(
  '/',
  asyncHandler(appointmentController.getAppointments)
);

router.get(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(appointmentController.getAppointmentById)
);

router.put(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
  runValidation,
  asyncHandler(appointmentController.updateAppointmentStatus)
);

router.delete(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(appointmentController.cancelAppointment)
);

module.exports = router;
