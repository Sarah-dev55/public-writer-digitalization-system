const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/client/client_notifications');

// Get all notifications for a user (and trigger reminders)
router.get('/user/:userId', notificationController.getUserNotifications);

// Mark single notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark ALL as read
router.put('/user/:userId/read-all', notificationController.markAllAsRead);

module.exports = router;
