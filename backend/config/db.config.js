const mongoose = require('mongoose');

let isDBConnected = false;

/**
 * Connect to MongoDB. Does not throw on failure; returns false for fallback mode.
 * @returns {Promise<boolean>} True if connected, false otherwise
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-interview';
  const options = {
    // mongoose 6+ uses these by default; kept for older versions if needed
  };

  try {
    await mongoose.connect(uri, options);
    isDBConnected = true;
    console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
    return true;
  } catch (err) {
    isDBConnected = false;
    console.warn('[DB] MongoDB unavailable - running in fallback (JSON file) mode.');
    console.warn('[DB] Error:', err.message);
    return false;
  }
};

/**
 * Get current database connection status.
 * @returns {boolean}
 */
const getDBStatus = () => isDBConnected;

mongoose.connection.on('connected', () => {
  isDBConnected = true;
  console.log('[DB] MongoDB connection event: connected');
});

mongoose.connection.on('error', (err) => {
  isDBConnected = false;
  console.error('[DB] MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isDBConnected = false;
  console.warn('[DB] MongoDB disconnected');
});

module.exports = { connectDB, getDBStatus };
