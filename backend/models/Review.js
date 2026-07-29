const mongoose = require('mongoose');

/**
 * Review Schema
 * Community feedback on items and their owners
 */
const reviewSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item reference is required'],
  },

  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer reference is required'],
  },

  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },

  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [5, 'Comment must be at least 5 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
}, {
  timestamps: true,
});

// One review per user per item
reviewSchema.index({ item: 1, reviewer: 1 }, { unique: true });
reviewSchema.index({ item: 1 });

// Auto-calculate average rating on Item after save/remove
reviewSchema.post('save', async function () {
  const Item   = require('./Item');
  // Note: aggregation pipeline to update avg rating can be added here
  // For now, average is computed on-the-fly in the controller
});

module.exports = mongoose.model('Review', reviewSchema);
