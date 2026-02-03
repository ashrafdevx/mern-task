const { WhyChoose } = require('../models/whyChoose.model');
const { ApiResponse } = require('../utils/apiResponse.util');
const { ApiError } = require('../utils/apiError.util');
const { HTTP_STATUS, DATA_FILES } = require('../config/constants');

/**
 * GET /api/why-choose
 * Returns metrics for the "Why Choose for us?" module.
 * Uses MongoDB aggregation pipeline when DB is available,
 * otherwise falls back to local JSON file.
 */
async function getWhyChooseMetrics(req, res, next) {
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const data = await WhyChoose.getActiveMetrics();
    const response = new ApiResponse(
      HTTP_STATUS.OK,
      data,
      'Why choose metrics retrieved',
      { source, count: data.length }
    );
    return response.send(res);
  }

  let data = req.fallbackManager.readFromFile(DATA_FILES.WHY_CHOOSE);
  if (!Array.isArray(data)) {
    data = [];
  }
  data = data
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const response = new ApiResponse(
    HTTP_STATUS.OK,
    data,
    'Why choose metrics retrieved',
    { source, count: data.length }
  );
  response.send(res);
}

module.exports = {
  getWhyChooseMetrics,
};

