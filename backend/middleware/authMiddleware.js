// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger'); // Import logger

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password'); // Do not include password

      if (req.user) {
        logger.info(`User authenticated successfully: ${req.user.email}`);
      }

      next();
    } catch (error) {
      logger.error(`Authorization failed: Invalid token - ${error.message}`);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    if (!token) {
      logger.warn('Authorization failed: No token provided');
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }
};

module.exports = { protect };
