const jwt = require('jsonwebtoken');

const authenticateJudge = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'judge') {
      return res.status(403).json({ success: false, message: 'Judge privileges required' });
    }
    req.judge = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = authenticateJudge;
