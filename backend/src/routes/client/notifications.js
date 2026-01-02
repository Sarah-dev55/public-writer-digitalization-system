const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/client/client_notifications');

// Get all messages for a user
router.get('/user/:userId', notificationController.getUserNotifications);

// Mark one message as read
router.put('/:id/read', notificationController.markAsRead);

// Mark every message as read
router.put('/user/:userId/read-all', notificationController.markAllAsRead);

module.exports = router;
