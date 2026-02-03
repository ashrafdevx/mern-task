require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getDBStatus } = require('./config/db.config');
const expertStaffRoutes = require('./routes/expertStaff.route');
const hotelRoutes = require('./routes/hotel.route');
const appointmentRoutes = require('./routes/appointment.route');
const whyChooseRoutes = require('./routes/whyChoose.route');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(morgan('dev'));

// Database connection (non-blocking; fallback mode if connection fails)
let dbConnected = false;
connectDB()
  .then((connected) => {
    dbConnected = connected;
    console.log(connected ? '[Server] Using MongoDB' : '[Server] Using fallback (JSON files)');
  })
  .catch(() => {
    dbConnected = false;
    console.warn('[Server] Using fallback (JSON files)');
  });

// API routes
app.use('/api/expert-staff', expertStaffRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/why-choose', whyChooseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const database = getDBStatus() ? 'connected' : 'fallback';
  res.status(200).json({
    status: 'OK',
    database,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined routes (must be after all routes)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (4 args - must be last)
app.use((err, req, res, next) => errorHandler(err, req, res, next));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  const mode = getDBStatus() ? 'DB' : 'fallback';
  console.log(`[Server] Running on http://localhost:${PORT} (${mode} mode)`);
});
