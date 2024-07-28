const jwt = require('jsonwebtoken');
const SECRET_KEY = 'ksPOJ92jNJL23nd'; // can create a .env file to store this

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateToken;