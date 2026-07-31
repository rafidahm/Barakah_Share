const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: sign JWT ──────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ── POST /api/auth/register ───────────────────────────────────
/**
 * Register a new user with email + password
 * Body: { name, email, password, department? }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, department, firebaseUid } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Domain restriction validation (Backend safeguard)
    const emailLower = email.toLowerCase().trim();
    if (!emailLower.endsWith('@ugrad.iiuc.ac.bd') && !emailLower.endsWith('@iiuc.ac.bd')) {
      return res.status(400).json({
        success: false,
        message: 'Registration is restricted to IIUC university emails (@ugrad.iiuc.ac.bd or @iiuc.ac.bd).',
      });
    }

    // Check duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ name, email, password, department, firebaseUid, provider: 'email' });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
        provider:   user.provider,
        createdAt:  user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Registration failed.', error: err.message });
  }
};

// ── POST /api/auth/login ──────────────────────────────────────
/**
 * Login with email + password
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Fetch user with password (select: false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
        provider:   user.provider,
        createdAt:  user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login failed.', error: err.message });
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────
/**
 * Get current authenticated user profile
 * Requires: verifyToken middleware
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch user.', error: err.message });
  }
};

// ── PATCH /api/auth/me ────────────────────────────────────────
/**
 * Update current user's own profile (name, department)
 * Body: { name?, department? }
 */
exports.updateMe = async (req, res) => {
  try {
    const { name, department, avatar } = req.body;
    const updates = {};
    if (name !== undefined)       updates.name       = name.trim();
    if (department !== undefined) updates.department = department.trim();
    if (avatar !== undefined)     updates.avatar     = avatar.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed.', error: err.message });
  }
};

// ── GET /api/auth/users (Admin) ───────────────────────────────
/**
 * Admin: Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch users.', error: err.message });
  }
};

// ── PATCH /api/auth/users/:id/role (Admin) ────────────────────
/**
 * Admin: Change user role (user ↔ admin)
 * Body: { role: 'admin' | 'user' }
 */
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be 'admin' or 'user'." });
    }

    // Prevent admin from downgrading themselves
    if (req.params.id === String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You cannot change your own role.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Role change failed.', error: err.message });
  }
};
