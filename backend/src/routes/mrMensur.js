const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/verify', userController.verify);
router.post('/resend-code', userController.resendCode);

// Protected routes (require authentication)
router.get('/me', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;