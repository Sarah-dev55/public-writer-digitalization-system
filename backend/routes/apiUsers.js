const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');

router.get('/', userController.list);
router.get('/:id', userController.getById);

module.exports = router;
