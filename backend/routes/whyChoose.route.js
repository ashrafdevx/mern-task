const express = require('express');
const { checkDBMiddleware } = require('../middleware/fallback.middleware');
const { asyncHandler } = require('../utils/asyncHandler.util');
const { getWhyChooseMetrics } = require('../controllers/whyChoose.controller');

const router = express.Router();

// Attach DB / fallback info
router.use(checkDBMiddleware);

// GET /api/why-choose
router.get('/', asyncHandler(getWhyChooseMetrics));

module.exports = router;

