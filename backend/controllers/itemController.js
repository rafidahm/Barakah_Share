const Item = require('../models/Item');
const Request = require('../models/Request');

// ── GET /api/items ────────────────────────────────────────────
/**
 * Browse/filter items
 * Query params: status, type, category, condition, search, sort, page, limit
 */
exports.getItems = async (req, res) => {
  try {
    const {
      status   = 'AVAILABLE',
      type,
      category,
      condition,
      search,
      sort     = 'newest',
      page     = 1,
      limit    = 12,
    } = req.query;

    // Build filter object
    const filter = {};

    if (status && status !== 'all') filter.status = status.toUpperCase();
    if (type     && type     !== 'All')  filter.type      = type.toUpperCase();
    if (category && category !== 'All')  filter.category  = category;
    if (condition && condition !== 'Any') filter.condition = condition;

    // Full-text search (uses the text index on name + description)
    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    // Sort
    const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // Pagination
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Item.countDocuments(filter);

    const items = await Item.find(filter)
      .populate('owner', 'name email department avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      items,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch items.', error: err.message });
  }
};

// ── GET /api/items/:id ────────────────────────────────────────
/**
 * Get a single item by ID with owner details
 */
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email department avatar createdAt');

    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    res.status(200).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch item.', error: err.message });
  }
};

// ── POST /api/items ───────────────────────────────────────────
/**
 * Create a new item
 * Requires: verifyToken
 * Body: { name, category, description, type, condition, quantity }
 */
exports.createItem = async (req, res) => {
  try {
    const { name, category, description, type, condition, quantity } = req.body;

    const item = await Item.create({
      name, category, description, type, condition,
      quantity: quantity || 1,
      owner: req.user._id,
      status: 'AVAILABLE',
    });

    await item.populate('owner', 'name email department avatar');

    res.status(201).json({ success: true, item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Could not create item.', error: err.message });
  }
};

// ── PATCH /api/items/:id ──────────────────────────────────────
/**
 * Update an item (owner only, only when AVAILABLE)
 * Admin can update any item regardless of status
 */
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    const isOwner = String(item.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this item.' });
    }

    // Non-admins can only edit AVAILABLE items
    if (!isAdmin && item.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'Cannot edit an item that is not AVAILABLE.' });
    }

    const allowed = ['name', 'category', 'description', 'condition', 'quantity'];
    // Admin can also change status directly
    if (isAdmin) allowed.push('status', 'type');

    allowed.forEach(field => {
      if (req.body[field] !== undefined) item[field] = req.body[field];
    });

    await item.save();
    await item.populate('owner', 'name email department avatar');

    res.status(200).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed.', error: err.message });
  }
};

// ── DELETE /api/items/:id ─────────────────────────────────────
/**
 * Delete an item (owner/admin only, only when AVAILABLE or DEACTIVATED)
 */
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    const isOwner = String(item.owner) === String(req.user._id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item.' });
    }

    if (!isAdmin && !['AVAILABLE', 'DEACTIVATED'].includes(item.status)) {
      return res.status(400).json({ success: false, message: 'Cannot delete an active item. Deactivate it first.' });
    }

    // Cascade: remove all requests for this item
    await Request.deleteMany({ item: item._id });
    await item.deleteOne();

    res.status(200).json({ success: true, message: 'Item deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delete failed.', error: err.message });
  }
};

// ── PATCH /api/items/:id/deactivate ──────────────────────────
/**
 * Deactivate an item (owner only, AVAILABLE → DEACTIVATED)
 */
exports.deactivateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'Only AVAILABLE items can be deactivated.' });
    }

    item.status = 'DEACTIVATED';
    await item.save();

    res.status(200).json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Deactivation failed.', error: err.message });
  }
};

// ── GET /api/items/my ─────────────────────────────────────────
/**
 * Get items posted by the logged-in user
 */
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch your items.', error: err.message });
  }
};
