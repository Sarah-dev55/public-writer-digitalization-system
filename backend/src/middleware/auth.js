const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async(req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this page'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your account first'
            });
        }

        req.user = user;
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

module.exports = authMiddleware;