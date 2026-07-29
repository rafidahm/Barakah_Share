const router      = require('express').Router();
const ctrl        = require('../controllers/itemController');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// Public routes
router.get ('/',    ctrl.getItems);
router.get ('/my',  verifyToken, ctrl.getMyItems);   // must be before /:id
router.get ('/:id', ctrl.getItemById);

// Protected routes (logged in)
router.post('/',               verifyToken, ctrl.createItem);
router.patch('/:id',           verifyToken, ctrl.updateItem);
router.delete('/:id',          verifyToken, ctrl.deleteItem);
router.patch('/:id/deactivate',verifyToken, ctrl.deactivateItem);

module.exports = router;
