/**
 * Application constants and configuration values.
 */

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const APPOINTMENT_STATUS = ['pending', 'confirmed', 'cancelled', 'completed'];
const PAYMENT_STATUS = ['pending', 'paid', 'refunded'];
const HOTEL_CATEGORY = ['budget', 'standard', 'luxury'];

const DATA_FILES = {
  EXPERT_STAFF: 'expertStaff.json',
  HOTELS: 'hotels.json',
  APPOINTMENTS: 'appointments.json',
  WHY_CHOOSE: 'whyChoose.json',
};

module.exports = {
  HTTP_STATUS,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  HOTEL_CATEGORY,
  DATA_FILES,
};
