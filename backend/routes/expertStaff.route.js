const express = require('express');
const { body, param } = require('express-validator');
const { checkDBMiddleware } = require('../middleware/fallback.middleware');
const { runValidation } = require('../middleware/validation.middleware');
const { asyncHandler } = require('../utils/asyncHandler.util');
const expertStaffController = require('../controllers/expertStaff.controller');

const router = express.Router();

router.use(checkDBMiddleware);

router.get(
  '/',
  asyncHandler(expertStaffController.getExpertStaff)
);

router.get(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(expertStaffController.getExpertStaffById)
);

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be non-negative'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio max 500 characters'),
  ],
  runValidation,
  asyncHandler(expertStaffController.createExpertStaff)
);

router.put(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  asyncHandler(expertStaffController.updateExpertStaff)
);

router.delete(
  '/:id',
  param('id').notEmpty().withMessage('ID is required'),
  runValidation,
  asyncHandler(expertStaffController.deleteExpertStaff)
);

module.exports = router;
