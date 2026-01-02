const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/signup', authController.signup);

router.post('/signin', authController.signin);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
