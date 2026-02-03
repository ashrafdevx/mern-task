const { Hotel } = require('../models/hotel.model');
const { ApiResponse } = require('../utils/apiResponse.util');
const { ApiError } = require('../utils/apiError.util');
const { HTTP_STATUS } = require('../config/constants');
const { DATA_FILES } = require('../config/constants');

/**
 * GET /api/hotels - Get all hotels with optional filters.
 */
async function getHotels(req, res, next) {
  const { location, minPrice, maxPrice, available, category, minRating } = req.query;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const query = {};
    // Default to available hotels only
    query.isAvailable = available !== undefined ? available === 'true' : true;
    if (location) query.location = new RegExp(location, 'i');
    if (category) query.category = category;
    if (minPrice != null || maxPrice != null) {
      query.price = {};
      if (minPrice != null) query.price.$gte = Number(minPrice);
      if (maxPrice != null) query.price.$lte = Number(maxPrice);
    }
    if (minRating != null) query.rating = { $gte: Number(minRating) };
    const data = await Hotel.find(query)
      .select('-__v')
      .sort({ rating: -1, price: 1 })
      .lean();
    const response = new ApiResponse(HTTP_STATUS.OK, data, 'Hotels retrieved', {
      source,
      count: data.length,
    });
    return response.send(res);
  }

  const queryObject = {};
  // Default to available hotels only
  queryObject.isAvailable = available !== undefined ? available === 'true' : true;
  if (location) queryObject.location = location;
  if (minPrice != null) queryObject.minPrice = Number(minPrice);
  if (maxPrice != null) queryObject.maxPrice = Number(maxPrice);
  if (category) queryObject.category = category;
  if (minRating != null) queryObject.minRating = Number(minRating);
  let data = req.fallbackManager.findWithQuery(DATA_FILES.HOTELS, queryObject);
  data.sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0);
    return (a.price || 0) - (b.price || 0);
  });
  const response = new ApiResponse(HTTP_STATUS.OK, data, 'Hotels retrieved', {
    source,
    count: data.length,
  });
  response.send(res);
}

/**
 * GET /api/hotels/:id - Get single hotel.
 */
async function getHotelById(req, res, next) {
  const { id } = req.params;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await Hotel.findById(id).select('-__v').lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Hotel not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Hotel retrieved', { source });
    return response.send(res);
  }

  const doc = req.fallbackManager.findById(DATA_FILES.HOTELS, id);
  if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Hotel not found');
  const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Hotel retrieved', { source });
  response.send(res);
}

/**
 * POST /api/hotels - Create new hotel (optional/admin).
 */
async function createHotel(req, res, next) {
  const body = req.body;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await Hotel.create(body);
    const data = doc.toObject();
    delete data.__v;
    const response = new ApiResponse(HTTP_STATUS.CREATED, data, 'Hotel created', { source });
    return response.send(res);
  }

  const recordWithId = {
    ...body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const newRecord = req.fallbackManager.appendToFile(DATA_FILES.HOTELS, recordWithId);
  if (!newRecord) throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to create hotel');
  const response = new ApiResponse(HTTP_STATUS.CREATED, newRecord, 'Hotel created', { source });
  response.send(res);
}

/**
 * PUT /api/hotels/:id - Update hotel (optional/admin).
 */
async function updateHotel(req, res, next) {
  const { id } = req.params;
  const updateData = req.body;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Hotel not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Hotel updated', { source });
    return response.send(res);
  }

  const updated = req.fallbackManager.updateInFile(DATA_FILES.HOTELS, id, updateData);
  if (!updated) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Hotel not found');
  const response = new ApiResponse(HTTP_STATUS.OK, updated, 'Hotel updated', { source });
  response.send(res);
}

/**
 * DELETE /api/hotels/:id - Delete hotel (optional/admin).
 */
async function deleteHotel(req, res, next) {
  const { id } = req.params;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await Hotel.findByIdAndDelete(id);
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Hotel not found');
    const response = new ApiResponse(HTTP_STATUS.OK, { id }, 'Hotel deleted', { source });
    return response.send(res);
  }

  const deleted = req.fallbackManager.deleteFromFile(DATA_FILES.HOTELS, id);
  if (!deleted) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Hotel not found');
  const response = new ApiResponse(HTTP_STATUS.OK, { id }, 'Hotel deleted', { source });
  response.send(res);
}

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
