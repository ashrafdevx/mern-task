/**
 * Custom error class for operational (expected) API errors.
 * Extends native Error with statusCode and isOperational flag.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404)
   * @param {string} message - Error message
   * @param {boolean} isOperational - True for expected errors (validation, not found)
   * @param {string} stack - Optional stack trace
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { ApiError };
