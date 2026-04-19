const { verifyToken } = require('../utils/jwt');

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // This will be enhanced when fetching user details
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
