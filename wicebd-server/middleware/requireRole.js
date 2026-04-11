/**
 * Role-based access control middleware.
 * Must be used AFTER authenticateAdmin.
 * Super admins always pass.
 */
const requireRole = (...allowed) => (req, res, next) => {
  // adminRole is in the JWT from authRoutes. Tokens issued before the migration
  // won't have it — fall back to super_admin so existing sessions aren't broken.
  const adminRole = req.admin?.adminRole || 'super_admin';
  if (adminRole === 'super_admin' || allowed.includes(adminRole)) return next();
  return res.status(403).json({ success: false, message: 'Insufficient permissions' });
};

module.exports = requireRole;
