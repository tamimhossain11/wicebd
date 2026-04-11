/**
 * Role-based access control middleware.
 * Must be used AFTER authenticateAdmin.
 * Super admins always pass.
 */
const requireRole = (...allowed) => (req, res, next) => {
  const adminRole = req.admin?.adminRole;
  if (!adminRole) return res.status(403).json({ success: false, message: 'No role assigned' });
  if (adminRole === 'super_admin' || allowed.includes(adminRole)) return next();
  return res.status(403).json({ success: false, message: 'Insufficient permissions' });
};

module.exports = requireRole;
