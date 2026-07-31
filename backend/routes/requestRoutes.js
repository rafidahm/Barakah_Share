const router      = require('express').Router();
const ctrl        = require('../controllers/requestController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// All request routes require authentication
router.use(verifyToken);

// Submit a new request
router.post('/', ctrl.createRequest);

// Get logged-in user's own requests
router.get('/my', ctrl.getMyRequests);

// Get incoming requests on user's owned items
router.get('/incoming', ctrl.getIncomingRequests);

// Admin: get all requests
router.get('/', verifyAdmin, ctrl.getAllRequests);

// Get requests for a specific item (owner or admin)
router.get('/item/:itemId', ctrl.getItemRequests);

// ── Donation lifecycle ──────────────────────────────────────
router.patch('/:id/approve',          ctrl.approveReceiver);   // Donor approves
router.patch('/:id/confirm-pickup',   ctrl.confirmPickup);     // Receiver confirms
router.patch('/:id/confirm-delivery', ctrl.confirmDelivery);   // Donor confirms delivery

// ── Lending lifecycle ───────────────────────────────────────
router.patch('/:id/approve-borrower', ctrl.approveBorrower);   // Lender approves
router.patch('/:id/confirm-receipt',  ctrl.confirmReceipt);    // Borrower confirms receipt
router.patch('/:id/initiate-return',  ctrl.initiateReturn);    // Borrower initiates return
router.patch('/:id/confirm-return',   ctrl.confirmReturn);     // Lender confirms return

// Shared
router.patch('/:id/reject', ctrl.rejectRequest);

module.exports = router;
