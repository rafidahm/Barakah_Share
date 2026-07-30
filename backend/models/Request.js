const mongoose = require('mongoose');

/**
 * Request Schema
 * Represents a receiver/borrower request for a specific item
 *
 * Donation lifecycle: PENDING → APPROVED → RECEIVED → COMPLETED
 *   RECEIVED  = receiver confirmed pickup
 *   COMPLETED = donor confirmed delivery (only after RECEIVED)
 *
 * Lending lifecycle: PENDING → APPROVED → IN_USE → PENDING_RETURN → RETURNED
 *   IN_USE         = borrower confirmed receipt
 *   PENDING_RETURN = borrower initiated return
 *   RETURNED       = lender confirmed return
 */
const requestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item reference is required'],
  },

  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester reference is required'],
  },

  status: {
    type: String,
    enum: [
      'PENDING',
      'APPROVED',
      'REJECTED',
      'RECEIVED',       // Donation: receiver confirmed pickup
      'IN_USE',         // Lending: borrower confirmed receipt
      'PENDING_RETURN', // Lending: borrower initiated return
      'RETURNED',       // Lending: lender confirmed return
      'COMPLETED',      // Donation: fully done
    ],
    default: 'PENDING',
  },

  // Optional message from requester
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: '',
  },

  // Timestamps for each lifecycle step
  approvedAt:      { type: Date, default: null },
  receivedAt:      { type: Date, default: null }, // Donation: receiver confirmed
  inUseAt:         { type: Date, default: null }, // Lending: borrower confirmed receipt
  returnInitiatedAt: { type: Date, default: null },
  completedAt:     { type: Date, default: null },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtuals for item_id and requester_id to align with frontend mock references
requestSchema.virtual('item_id').get(function () {
  if (!this.item) return undefined;
  return this.item._id ? this.item._id.toString() : this.item.toString();
});

requestSchema.virtual('requester_id').get(function () {
  if (!this.requester) return undefined;
  return this.requester._id ? this.requester._id.toString() : this.requester.toString();
});

// Business rule: one user can only have ONE active request per item
requestSchema.index({ item: 1, requester: 1 }, { unique: true });
requestSchema.index({ requester: 1, status: 1 });
requestSchema.index({ item: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
