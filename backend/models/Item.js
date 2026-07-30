const mongoose = require('mongoose');

/**
 * Item Schema
 * Represents a resource posted for donation or lending
 *
 * Donation status machine: AVAILABLE → CLAIMED → COMPLETED
 * Lending status machine:  AVAILABLE → CLAIMED → IN_USE → PENDING_RETURN → AVAILABLE
 */
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [120, 'Name cannot exceed 120 characters'],
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Books', 'Electronics', 'Calculators', 'Instruments', 'Lab Equipment', 'Clothes', 'Sports', 'Others'],
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },

  type: {
    type: String,
    required: [true, 'Item type is required'],
    enum: ['DONATE', 'LEND'],
  },

  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['New', 'Good', 'Fair', 'Poor'],
  },

  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [99, 'Quantity cannot exceed 99'],
    default: 1,
  },

  status: {
    type: String,
    enum: ['AVAILABLE', 'CLAIMED', 'IN_USE', 'PENDING_RETURN', 'COMPLETED', 'DEACTIVATED'],
    default: 'AVAILABLE',
  },

  // Owner (donor or lender)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
  },

  // Image URL (Firebase Storage in Phase 2)
  image: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual for owner_id to align with frontend mock data references
itemSchema.virtual('owner_id').get(function () {
  if (!this.owner) return undefined;
  return this.owner._id ? this.owner._id.toString() : this.owner.toString();
});

// Index for efficient browse+filter queries
itemSchema.index({ status: 1, type: 1, category: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ name: 'text', description: 'text' }); // Full-text search

module.exports = mongoose.model('Item', itemSchema);
