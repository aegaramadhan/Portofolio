// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
};

// Admin role middleware
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = {
  requireAuth,
  requireAdmin
};
