const Notification = require('../../models/Notification');
const Appointment = require('../../models/Appointment');
const { v4: uuidv4 } = require('uuid');

/**
 * Get all notifications for a user
 * ALSO simulates "Appointment Reminder" logic here for demo purposes
 * @route GET /api/client/notifications/:userId
 */
async function getUserNotifications(req, res) {
    try {
        const { userId } = req.params;

        // 1. Fetch real notifications from DB
        let notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        // 2. SIMULATE APPOINTMENT REMINDER (Local Logic)
        // Check if user has appointment tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const appointmentTomorrow = await Appointment.findOne({
            userId,
            date: tomorrowStr
        });

        // If exists, inject a "virtual" notification if not already in DB
        // (In a real app, a cron job would create this record permanently. 
        // Here we just check if we should show it dynamically or if we insert it now)

        if (appointmentTomorrow) {
            // Check if we already created a reminder for this appointment
            const existingReminder = await Notification.findOne({
                userId,
                title: 'Appointment Reminder',
                message: { $regex: new RegExp(appointmentTomorrow.date) }
            });

            if (!existingReminder) {
                // Create it now so it persists
                const reminder = new Notification({
                    userId,
                    title: 'Appointment Reminder',
                    message: `You have an appointment tomorrow (${appointmentTomorrow.date}) at ${appointmentTomorrow.timeSlot}.`,
                    type: 'info',
                    createdAt: new Date()
                });
                await reminder.save();
                // Add to list
                notifications.unshift(reminder);
            }
        }

        // 3. If no notifications at all, create a "Welcome" one (Seed logic)
        if (notifications.length === 0) {
            const welcomeNotif = new Notification({
                userId,
                title: 'Welcome!',
                message: 'Welcome to your digital dashboard. Here you can track your case progress.',
                type: 'success',
                createdAt: new Date()
            });
            await welcomeNotif.save();
            notifications.push(welcomeNotif);
        }

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Mark notification as read
 * @route PUT /api/client/notifications/:id/read
 */
async function markAsRead(req, res) {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * Mark ALL as read
 * @route PUT /api/client/notifications/user/:userId/read-all
 */
async function markAllAsRead(req, res) {
    try {
        const { userId } = req.params;
        await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );
        res.json({ message: 'All marked as read' });
    } catch (error) {
        console.error('Error marking all as read:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead
};
