/**
 * verifyAdmin middleware
 * Must be used AFTER verifyToken
 * Checks that the authenticated user has the 'admin' role
 */
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

module.exports = verifyAdmin;
