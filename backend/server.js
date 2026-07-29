/**
 * BarakahShare — Express Server (Phase 2 Backend)
 * ================================================
 * Stack: Node.js + Express + MongoDB (Mongoose) + Firebase Admin
 *
 * To start: npm run dev (nodemon) or npm start (production)
 * Ensure .env is configured before running (copy from .env.example)
 */

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const connectDB      = require('./config/db');
const { initFirebase } = require('./config/firebase');

// Route modules
const authRoutes    = require('./routes/authRoutes');
const itemRoutes    = require('./routes/itemRoutes');
const requestRoutes = require('./routes/requestRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');

// ── Initialize external services ─────────────────────────────
connectDB();      // Connect to MongoDB Atlas
initFirebase();   // Initialize Firebase Admin SDK

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────

// CORS — allow frontend dev server + production URL
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || 'http://localhost:5174',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/items',    itemRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews',  reviewRoutes);

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ BarakahShare API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Analytics endpoint (Admin) ────────────────────────────────
app.get('/api/analytics', async (req, res) => {
  try {
    const Item    = require('./models/Item');
    const Request = require('./models/Request');
    const User    = require('./models/User');
    const Review  = require('./models/Review');

    const [
      totalUsers,
      totalItems,
      totalRequests,
      totalReviews,
      availableItems,
      completedDonations,
      activeLoans,
      itemsByCategory,
      itemsByType,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Request.countDocuments(),
      Review.countDocuments(),
      Item.countDocuments({ status: 'AVAILABLE' }),
      Request.countDocuments({ status: 'COMPLETED' }),
      Request.countDocuments({ status: 'IN_USE' }),
      Item.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Item.aggregate([{ $group: { _id: '$type',     count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalItems,
        totalRequests,
        totalReviews,
        availableItems,
        completedDonations,
        activeLoans,
        itemsByCategory,
        itemsByType,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Analytics error.', error: err.message });
  }
});

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: errors.join(', ') });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format.' });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 BarakahShare API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
