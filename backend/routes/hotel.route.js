const express = require('express');
const { param } = require('express-validator');
const { checkDBMiddleware } = require('../middleware/fallback.middleware');
const { runValidation } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../utils/asyncHandler.util');
const hotelController = require('../controllers/hotel.controller');

const router = express.Router();

router.use(checkDBMiddleware);

router.get(
  '/',
  asyncHandler(hotelController.getHotels)
);

router.get(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(hotelController.getHotelById)
);

router.post(
  '/',
  asyncHandler(hotelController.createHotel)
);

router.put(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(hotelController.updateHotel)
);

router.delete(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(hotelController.deleteHotel)
);

module.exports = router;
