const jwt = require('jsonwebtoken');

// Sets req.user if a valid user token is present, but does NOT reject the request if absent.
const optionalUserAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);
      if (decoded.role === 'user') req.user = decoded;
    } catch {
      // invalid/expired token — continue without user
    }
  }
  next();
};

module.exports = optionalUserAuth;
