const Request = require('../models/Request');
const Item    = require('../models/Item');

// ── Shared helper: verify item owner ─────────────────────────
const ensureOwner = (item, userId) => String(item.owner) === String(userId);

// ── POST /api/requests ────────────────────────────────────────
/**
 * Create a request (receiver/borrower submits)
 * Body: { itemId, message? }
 * Rules:
 *  - Item must be AVAILABLE
 *  - User cannot request their own item
 *  - One active request per user per item (enforced by unique index)
 */
exports.createRequest = async (req, res) => {
  try {
    const itemId = req.body.itemId || req.body.item_id;
    const { message } = req.body;
    if (!itemId) return res.status(400).json({ success: false, message: 'itemId is required.' });

    const item = await Item.findById(itemId);
    if (!item)   return res.status(404).json({ success: false, message: 'Item not found.' });
    if (item.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'This item is not available for requests.' });
    }
    if (ensureOwner(item, req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot request your own item.' });
    }

    const request = await Request.create({
      item:      itemId,
      requester: req.user._id,
      message:   message || '',
      status:    'PENDING',
    });

    await request.populate([
      { path: 'item',      select: 'name type status category' },
      { path: 'requester', select: 'name email department' },
    ]);

    res.status(201).json({ success: true, request });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'You already have an active request for this item.' });
    }
    res.status(500).json({ success: false, message: 'Request failed.', error: err.message });
  }
};

// ── GET /api/requests/my ──────────────────────────────────────
/**
 * Get all requests made by the logged-in user
 */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .populate('item', 'name type status category condition owner')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch requests.', error: err.message });
  }
};

// ── GET /api/requests/item/:itemId ────────────────────────────
/**
 * Get all requests for a specific item (item owner or admin only)
 */
exports.getItemRequests = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (!ensureOwner(item, req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const requests = await Request.find({ item: req.params.itemId })
      .populate('requester', 'name email department avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch requests.', error: err.message });
  }
};

// ── GET /api/requests (Admin) ─────────────────────────────────
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('item',      'name type status')
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch requests.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/approve (DONATION) ───────────────
/**
 * Donor approves ONE receiver
 * → item: CLAIMED, request: APPROVED, all other PENDING rejected
 */
exports.approveReceiver = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const item = request.item;
    if (!ensureOwner(item, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the item owner can approve.' });
    }
    if (item.type !== 'DONATE') {
      return res.status(400).json({ success: false, message: 'Use /approve-borrower for LEND items.' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Can only approve PENDING requests.' });
    }

    // Approve this request
    request.status     = 'APPROVED';
    request.approvedAt = new Date();
    await request.save();

    // Reject all other pending requests for same item
    await Request.updateMany(
      { item: item._id, _id: { $ne: request._id }, status: 'PENDING' },
      { status: 'REJECTED' }
    );

    // Update item status
    item.status = 'CLAIMED';
    await item.save();

    res.status(200).json({ success: true, request, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Approval failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/confirm-pickup (DONATION) ────────
/**
 * Receiver confirms they picked up the item
 * → request: RECEIVED
 */
exports.confirmPickup = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (String(request.requester) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the requester can confirm pickup.' });
    }
    if (request.status !== 'APPROVED') {
      return res.status(400).json({ success: false, message: 'Request must be APPROVED before confirming pickup.' });
    }

    request.status     = 'RECEIVED';
    request.receivedAt = new Date();
    await request.save();

    res.status(200).json({ success: true, request, item: request.item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Pickup confirmation failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/confirm-delivery (DONATION) ──────
/**
 * Donor confirms delivery (after receiver confirmed pickup)
 * → item: COMPLETED, request: COMPLETED
 */
exports.confirmDelivery = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const item = request.item;
    if (!ensureOwner(item, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the item owner can confirm delivery.' });
    }
    if (request.status !== 'RECEIVED') {
      return res.status(400).json({ success: false, message: 'Receiver must confirm pickup first.' });
    }

    request.status      = 'COMPLETED';
    request.completedAt = new Date();
    await request.save();

    item.status = 'COMPLETED';
    await item.save();

    res.status(200).json({ success: true, request, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Delivery confirmation failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/approve-borrower (LENDING) ───────
/**
 * Lender approves ONE borrower
 * → item: CLAIMED, request: APPROVED
 */
exports.approveBorrower = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const item = request.item;
    if (!ensureOwner(item, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the item owner can approve.' });
    }
    if (item.type !== 'LEND') {
      return res.status(400).json({ success: false, message: 'Use /approve for DONATE items.' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Can only approve PENDING requests.' });
    }

    request.status     = 'APPROVED';
    request.approvedAt = new Date();
    await request.save();

    await Request.updateMany(
      { item: item._id, _id: { $ne: request._id }, status: 'PENDING' },
      { status: 'REJECTED' }
    );

    item.status = 'CLAIMED';
    await item.save();

    res.status(200).json({ success: true, request, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Borrower approval failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/confirm-receipt (LENDING) ────────
/**
 * Borrower confirms they received the item
 * → item: IN_USE, request: IN_USE
 */
exports.confirmReceipt = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (String(request.requester) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the borrower can confirm receipt.' });
    }
    if (request.status !== 'APPROVED') {
      return res.status(400).json({ success: false, message: 'Request must be APPROVED first.' });
    }

    request.status   = 'IN_USE';
    request.inUseAt  = new Date();
    await request.save();

    request.item.status = 'IN_USE';
    await request.item.save();

    res.status(200).json({ success: true, request, item: request.item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Receipt confirmation failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/initiate-return (LENDING) ────────
/**
 * Borrower initiates return
 * → item: PENDING_RETURN, request: PENDING_RETURN
 */
exports.initiateReturn = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    if (String(request.requester) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the borrower can initiate a return.' });
    }
    if (request.status !== 'IN_USE') {
      return res.status(400).json({ success: false, message: 'Item must be IN_USE to initiate return.' });
    }

    request.status             = 'PENDING_RETURN';
    request.returnInitiatedAt  = new Date();
    await request.save();

    request.item.status = 'PENDING_RETURN';
    await request.item.save();

    res.status(200).json({ success: true, request, item: request.item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Return initiation failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/confirm-return (LENDING) ─────────
/**
 * Lender confirms return received
 * → item: AVAILABLE, request: RETURNED
 */
exports.confirmReturn = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const item = request.item;
    if (!ensureOwner(item, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Only the item owner can confirm return.' });
    }
    if (request.status !== 'PENDING_RETURN') {
      return res.status(400).json({ success: false, message: 'Borrower must initiate return first.' });
    }

    request.status      = 'RETURNED';
    request.completedAt = new Date();
    await request.save();

    item.status = 'AVAILABLE';
    await item.save();

    res.status(200).json({ success: true, request, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Return confirmation failed.', error: err.message });
  }
};

// ── PATCH /api/requests/:id/reject ───────────────────────────
/**
 * Owner rejects a pending request
 * → request: REJECTED
 */
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('item');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    const item = request.item;
    if (!ensureOwner(item, req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the item owner or admin can reject.' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Can only reject PENDING requests.' });
    }

    request.status = 'REJECTED';
    await request.save();

    res.status(200).json({ success: true, request, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Rejection failed.', error: err.message });
  }
};
