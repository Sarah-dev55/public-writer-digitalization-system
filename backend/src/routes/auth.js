const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/signin
router.post('/signin', authController.signin);

// POST /api/auth/login (alias for signin)
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
