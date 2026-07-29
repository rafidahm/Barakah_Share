const router      = require('express').Router();
const ctrl        = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public routes
router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);

// Protected routes
router.get ('/me',   verifyToken, ctrl.getMe);
router.patch('/me',  verifyToken, ctrl.updateMe);

// Admin routes
router.get ('/users',          verifyToken, verifyAdmin, ctrl.getAllUsers);
router.patch('/users/:id/role',verifyToken, verifyAdmin, ctrl.changeUserRole);

module.exports = router;
