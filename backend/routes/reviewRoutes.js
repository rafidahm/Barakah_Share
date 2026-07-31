const router      = require('express').Router();
const ctrl        = require('../controllers/reviewController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public
router.get('/item/:itemId', ctrl.getItemReviews);
router.get('/recent',      ctrl.getRecentReviews);

// Protected
router.post('/',   verifyToken, ctrl.addReview);
router.get('/my',  verifyToken, ctrl.getMyReviews);

// Admin
router.get ('/',    verifyToken, verifyAdmin, ctrl.getAllReviews);
router.delete('/:id', verifyToken, verifyAdmin, ctrl.deleteReview);

module.exports = router;
