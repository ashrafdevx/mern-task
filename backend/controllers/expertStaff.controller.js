const { ExpertStaff } = require('../models/expertStaff.model');
const { ApiResponse } = require('../utils/apiResponse.util');
const { ApiError } = require('../utils/apiError.util');
const { HTTP_STATUS } = require('../config/constants');
const { DATA_FILES } = require('../config/constants');

/**
 * GET /api/expert-staff - Get all expert staff with optional filters.
 */
async function getExpertStaff(req, res, next) {
  const { position, isActive, search } = req.query;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const query = {};
    // Default to active staff only
    query.isActive = isActive !== undefined ? isActive === 'true' : true;
    if (position) query.position = new RegExp(position, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') },
      ];
    }
    const data = await ExpertStaff.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();
    const response = new ApiResponse(HTTP_STATUS.OK, data, 'Expert staff retrieved', {
      source,
      count: data.length,
    });
    return response.send(res);
  }

  let data = req.fallbackManager.readFromFile(DATA_FILES.EXPERT_STAFF);
  // Default to active staff only
  const activeFilter = isActive !== undefined ? isActive === 'true' : true;
  data = data.filter((item) => item.isActive === activeFilter);
  if (position) {
    data = data.filter((item) => item.position && item.position.toLowerCase().includes(position.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    data = data.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(s)) ||
        (item.bio && item.bio.toLowerCase().includes(s))
    );
  }
  data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const response = new ApiResponse(HTTP_STATUS.OK, data, 'Expert staff retrieved', {
    source,
    count: data.length,
  });
  response.send(res);
}

/**
 * GET /api/expert-staff/:id - Get single staff member.
 */
async function getExpertStaffById(req, res, next) {
  const { id } = req.params;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await ExpertStaff.findById(id).select('-__v').lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert staff not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Expert staff retrieved', { source });
    return response.send(res);
  }

  const doc = req.fallbackManager.findById(DATA_FILES.EXPERT_STAFF, id);
  if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert staff not found');
  const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Expert staff retrieved', { source });
  response.send(res);
}

/**
 * POST /api/expert-staff - Create new staff (optional/admin).
 */
async function createExpertStaff(req, res, next) {
  const body = req.body;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await ExpertStaff.create(body);
    const data = doc.toObject();
    delete data.__v;
    const response = new ApiResponse(HTTP_STATUS.CREATED, data, 'Expert staff created', { source });
    return response.send(res);
  }

  const recordWithId = {
    ...body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const newRecord = req.fallbackManager.appendToFile(DATA_FILES.EXPERT_STAFF, recordWithId);
  if (!newRecord) throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to create expert staff');
  const response = new ApiResponse(HTTP_STATUS.CREATED, newRecord, 'Expert staff created', { source });
  response.send(res);
}

/**
 * PUT /api/expert-staff/:id - Update staff (optional/admin).
 */
async function updateExpertStaff(req, res, next) {
  const { id } = req.params;
  const updateData = req.body;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await ExpertStaff.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-__v')
      .lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert staff not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Expert staff updated', { source });
    return response.send(res);
  }

  const updated = req.fallbackManager.updateInFile(DATA_FILES.EXPERT_STAFF, id, updateData);
  if (!updated) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert staff not found');
  const response = new ApiResponse(HTTP_STATUS.OK, updated, 'Expert staff updated', { source });
  response.send(res);
}

/**
 * DELETE /api/expert-staff/:id - Delete staff (optional; soft or hard).
 */
async function deleteExpertStaff(req, res, next) {
  const { id } = req.params;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await ExpertStaff.findByIdAndDelete(id);
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert staff not found');
    const response = new ApiResponse(HTTP_STATUS.OK, { id }, 'Expert staff deleted', { source });
    return response.send(res);
  }

  const deleted = req.fallbackManager.deleteFromFile(DATA_FILES.EXPERT_STAFF, id);
  if (!deleted) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Expert staff not found');
  const response = new ApiResponse(HTTP_STATUS.OK, { id }, 'Expert staff deleted', { source });
  response.send(res);
}

module.exports = {
  getExpertStaff,
  getExpertStaffById,
  createExpertStaff,
  updateExpertStaff,
  deleteExpertStaff,
};
