/**
 * Standardized API response format for consistent client responses.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response payload
   * @param {string} message - Human-readable message
   * @param {Object} metadata - Optional metadata (source, count, pagination, etc.)
   */
  constructor(statusCode, data, message = 'Success', metadata = {}) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.metadata = metadata;
  }

  /**
   * Send response to client.
   * @param {import('express').Response} res - Express response object
   */
  send(res) {
    res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      data: this.data,
      message: this.message,
      ...(Object.keys(this.metadata).length > 0 && { metadata: this.metadata }),
    });
  }
}

module.exports = { ApiResponse };
