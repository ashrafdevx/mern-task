const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/apiError.util');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Runs express-validator and throws ApiError if validation fails.
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  const errors = result.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));
  throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', true);
}

/**
 * Middleware that sends validation errors in response (for use with validate()).
 * Use after validate() in chain - or use runValidation which does both.
 */
function runValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }
  const errors = result.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    success: false,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    message: 'Validation failed',
    errors,
  });
}

module.exports = { validate, runValidation };
