const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getTokenFromReq = (req) => {
  const auth = req.headers && (req.headers.authorization || req.headers.Authorization);
  if (auth && typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    return auth.split(' ')[1];
  }
  if (req.query && req.query.token) return req.query.token;
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
};

async function verifyToken(req, res, next) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    // Put simple user info in the request object
    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      fullName: user.fullName
    };

    next();
  } catch (error) {
    console.error('verifyToken error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

function requireRole(...allowedRoles) {
  // Check if the user has the right role
  const allowed = allowedRoles.flat();
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (allowed.length === 0) return next();
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
