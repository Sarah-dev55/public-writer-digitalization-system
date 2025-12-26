const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/verify', userController.verify);
router.post('/resend-code', userController.resendCode);

module.exports = router;