const jwt         = require('jsonwebtoken');
const { admin }   = require('../config/firebase');
const User        = require('../models/User');

/**
 * verifyToken middleware
 *
 * Strategy:
 *   1. Check Authorization header for Bearer token
 *   2. Try to verify as Firebase ID token first (Google auth)
 *   3. Fall back to JWT (email/password auth)
 *   4. Attach req.user with the DB user document
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided. Access denied.' });
    }

    const token = authHeader.split(' ')[1];
    let user = null;

    // ── Try Firebase ID Token first ──────────────────────────
    try {
      const decoded = await admin.auth().verifyIdToken(token);

      // Enforce university email domain for Google authentication
      const emailLower = (decoded.email || '').toLowerCase().trim();
      if (!emailLower.endsWith('@ugrad.iiuc.ac.bd') && !emailLower.endsWith('@iiuc.ac.bd')) {
        return res.status(403).json({
          success: false,
          message: 'Access restricted to IIUC university emails (@ugrad.iiuc.ac.bd or @iiuc.ac.bd).',
        });
      }

      user = await User.findOne({ firebaseUid: decoded.uid });

      // Fallback: search by email to link existing email/password accounts
      if (!user && decoded.email) {
        user = await User.findOne({ email: decoded.email.toLowerCase().trim() });
        if (user) {
          user.firebaseUid = decoded.uid;
          await user.save();
        }
      }

      // Auto-create user in DB if signing in with Google for first time
      if (!user) {
        user = await User.create({
          firebaseUid: decoded.uid,
          name:     decoded.name  || 'Anonymous',
          email:    decoded.email,
          provider: 'google',
          role:     'user',
        });
      }
    } catch (err) {
      // ── Try JWT fallback ─────────────────────────────────────
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('-password');
        if (!user) throw new Error('User not found');
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Auth middleware error.', error: error.message });
  }
};

module.exports = verifyToken;
