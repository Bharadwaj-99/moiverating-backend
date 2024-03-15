const jwt = require('jsonwebtoken');
const User = require('./schema');
const CONST = require('../constants');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token not found' });
  }

  try {
    const decoded = jwt.verify(token, CONST.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      throw new Error('User not found');
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateToken;