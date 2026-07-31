const Review  = require('../models/Review');
const Request = require('../models/Request');
const Item    = require('../models/Item');

// ── POST /api/reviews ─────────────────────────────────────────
/**
 * Add a review for an item
 * Rules:
 *  - User cannot review their own item
 *  - User must have a COMPLETED or RETURNED request for this item
 *  - One review per user per item (enforced by unique index)
 * Body: { itemId, rating, comment }
 */
exports.addReview = async (req, res) => {
  try {
    const itemId = req.body.itemId || req.body.item_id;
    const { rating, comment } = req.body;

    if (!itemId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'itemId, rating, and comment are required.' });
    }

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    // Cannot review own item
    if (String(item.owner) === String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You cannot review your own item.' });
    }

    // Must have completed/returned transaction
    const eligible = await Request.findOne({
      item:      itemId,
      requester: req.user._id,
      status:    { $in: ['COMPLETED', 'RETURNED'] },
    });

    if (!eligible) {
      return res.status(403).json({
        success: false,
        message: 'You can only review items you have received or borrowed and returned.',
      });
    }

    const review = await Review.create({
      item:     itemId,
      reviewer: req.user._id,
      rating:   Number(rating),
      comment:  comment.trim(),
    });

    await review.populate('reviewer', 'name email department avatar');

    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this item.' });
    }
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Could not add review.', error: err.message });
  }
};

// ── GET /api/reviews/item/:itemId ─────────────────────────────
/**
 * Get all reviews for a specific item with average rating
 */
exports.getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate('reviewer', 'name email department avatar')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      success: true,
      count:      reviews.length,
      avgRating:  Math.round(avgRating * 10) / 10,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch reviews.', error: err.message });
  }
};

// ── GET /api/reviews/my ───────────────────────────────────────
/**
 * Get all reviews written by the logged-in user
 */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user._id })
      .populate('item', 'name category type')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch reviews.', error: err.message });
  }
};

// ── DELETE /api/reviews/:id (Admin) ──────────────────────────
/**
 * Admin: delete any review
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed.', error: err.message });
  }
};

// ── GET /api/reviews (Admin) ──────────────────────────────────
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('item',     'name type')
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch reviews.', error: err.message });
  }
};

// ── GET /api/reviews/recent (Public) ───────────────────────────
exports.getRecentReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('item', 'name type')
      .populate('reviewer', 'name email department avatar')
      .sort({ createdAt: -1 })
      .limit(12);
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch recent reviews.', error: err.message });
  }
};
