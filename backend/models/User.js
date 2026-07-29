const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

/**
 * User Schema
 * Stores both email/password users and Google OAuth users (via Firebase UID)
 */
const userSchema = new mongoose.Schema({
  // Firebase UID — used when auth is via Firebase (Google / email)
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true, // allows null (for email/password users in dev)
  },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [80, 'Name cannot exceed 80 characters'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },

  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Never returned in queries by default
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  department: {
    type: String,
    trim: true,
    default: '',
  },

  avatar: {
    type: String, // URL (Firebase Storage or external)
    default: null,
  },

  // Auth provider
  provider: {
    type: String,
    enum: ['email', 'google'],
    default: 'email',
  },
}, {
  timestamps: true, // adds createdAt, updatedAt
});

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Virtual: full name initials (for avatars)
userSchema.virtual('initials').get(function () {
  return this.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
});

module.exports = mongoose.model('User', userSchema);
