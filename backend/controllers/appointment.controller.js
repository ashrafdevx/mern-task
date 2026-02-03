const { Appointment } = require('../models/appointment.model');
const { ApiResponse } = require('../utils/apiResponse.util');
const { ApiError } = require('../utils/apiError.util');
const { HTTP_STATUS } = require('../config/constants');
const { DATA_FILES, APPOINTMENT_STATUS } = require('../config/constants');

/**
 * POST /api/appointments - Create new appointment/booking (REQUIRED).
 */
async function createAppointment(req, res, next) {
  const body = req.body;
  const source = req.useDB ? 'database' : 'local-file';

  const {
    customerName,
    email,
    phone,
    hotelId,
    hotelName,
    checkInDate,
    checkOutDate,
    guests,
    rooms = 1,
    specialRequests,
  } = body;

  if (!customerName || !email || !phone || !hotelName || !checkInDate || !checkOutDate || !guests) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Missing required fields: customerName, email, phone, hotelName, checkInDate, checkOutDate, guests'
    );
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkIn < today) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Check-in date must be today or in the future');
  }
  if (checkOut <= checkIn) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Check-out date must be after check-in date');
  }
  if (guests < 1 || guests > 20) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Guests must be between 1 and 20');
  }

  const toSave = {
    customerName: customerName.trim(),
    email: email.trim().toLowerCase(),
    phone,
    hotelName: hotelName.trim(),
    checkInDate: checkIn,
    checkOutDate: checkOut,
    guests: Number(guests),
    rooms: Math.max(1, Number(rooms) || 1),
    specialRequests: specialRequests || '',
    status: 'pending',
    paymentStatus: 'pending',
  };
  if (hotelId && req.useDB) toSave.hotelId = hotelId;

  if (req.useDB) {
    const doc = await Appointment.create(toSave);
    const data = doc.toObject();
    delete data.__v;
    const response = new ApiResponse(HTTP_STATUS.CREATED, data, 'Appointment created successfully', {
      source,
      confirmation: `Booking confirmed for ${data.customerName} at ${data.hotelName}`,
    });
    return response.send(res);
  }

  const recordWithId = {
    ...toSave,
    checkInDate: toSave.checkInDate.toISOString(),
    checkOutDate: toSave.checkOutDate.toISOString(),
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const newRecord = req.fallbackManager.appendToFile(DATA_FILES.APPOINTMENTS, recordWithId);
  if (!newRecord) throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to create appointment');
  const response = new ApiResponse(HTTP_STATUS.CREATED, newRecord, 'Appointment created successfully', {
    source,
    confirmation: `Booking confirmed for ${newRecord.customerName} at ${newRecord.hotelName}`,
  });
  response.send(res);
}

/**
 * GET /api/appointments - Get all appointments with optional filters.
 */
async function getAppointments(req, res, next) {
  const { status, email, hotelId } = req.query;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const query = {};
    if (status) query.status = status;
    if (email) query.email = new RegExp(email, 'i');
    if (hotelId) query.hotelId = hotelId;
    const data = await Appointment.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .lean();
    const response = new ApiResponse(HTTP_STATUS.OK, data, 'Appointments retrieved', {
      source,
      count: data.length,
    });
    return response.send(res);
  }

  let data = req.fallbackManager.readFromFile(DATA_FILES.APPOINTMENTS);
  if (status) data = data.filter((item) => item.status === status);
  if (email) {
    const e = email.toLowerCase();
    data = data.filter((item) => item.email && item.email.toLowerCase().includes(e));
  }
  if (hotelId) data = data.filter((item) => String(item.hotelId) === String(hotelId));
  data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const response = new ApiResponse(HTTP_STATUS.OK, data, 'Appointments retrieved', {
    source,
    count: data.length,
  });
  response.send(res);
}

/**
 * GET /api/appointments/:id - Get single appointment.
 */
async function getAppointmentById(req, res, next) {
  const { id } = req.params;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await Appointment.findById(id).select('-__v').lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Appointment retrieved', { source });
    return response.send(res);
  }

  const doc = req.fallbackManager.findById(DATA_FILES.APPOINTMENTS, id);
  if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');
  const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Appointment retrieved', { source });
  response.send(res);
}

/**
 * PUT /api/appointments/:id - Update appointment status.
 */
async function updateAppointmentStatus(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  const source = req.useDB ? 'database' : 'local-file';

  if (!status || !APPOINTMENT_STATUS.includes(status)) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Invalid status. Must be one of: ${APPOINTMENT_STATUS.join(', ')}`
    );
  }

  if (req.useDB) {
    const doc = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .select('-__v')
      .lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Appointment status updated', { source });
    return response.send(res);
  }

  const updated = req.fallbackManager.updateInFile(DATA_FILES.APPOINTMENTS, id, { status });
  if (!updated) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');
  const response = new ApiResponse(HTTP_STATUS.OK, updated, 'Appointment status updated', { source });
  response.send(res);
}

/**
 * DELETE /api/appointments/:id - Cancel appointment.
 */
async function cancelAppointment(req, res, next) {
  const { id } = req.params;
  const source = req.useDB ? 'database' : 'local-file';

  if (req.useDB) {
    const doc = await Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    )
      .select('-__v')
      .lean();
    if (!doc) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');
    const response = new ApiResponse(HTTP_STATUS.OK, doc, 'Appointment cancelled', { source });
    return response.send(res);
  }

  const updated = req.fallbackManager.updateInFile(DATA_FILES.APPOINTMENTS, id, { status: 'cancelled' });
  if (!updated) throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Appointment not found');
  const response = new ApiResponse(HTTP_STATUS.OK, updated, 'Appointment cancelled', { source });
  response.send(res);
}

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
};
