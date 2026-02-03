/**
 * Wraps async controller functions to catch errors and pass to error handler.
 * Eliminates need for try-catch blocks in controllers.
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { asyncHandler };
