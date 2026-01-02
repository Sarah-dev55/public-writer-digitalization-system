const Notification = require('../../models/Notification');
const Appointment = require('../../models/Appointment');
const Document = require('../../models/Document');
const { v4: uuidv4 } = require('uuid');

// Get all the messages for the user
async function getUserNotifications(req, res) {
    try {
        const { userId } = req.params;

        // 1. Get real messages from the database
        let notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        // 2. Check for upcoming meetings
        // Check if there is a meeting tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const appointmentTomorrow = await Appointment.findOne({
            userId,
            date: tomorrowStr
        });

        // If there is a meeting, make a reminder message

        if (appointmentTomorrow) {
            // Check if we already sent a reminder
            const existingReminder = await Notification.findOne({
                userId,
                title: 'Appointment Reminder',
                message: { $regex: new RegExp(appointmentTomorrow.date) }
            });

            if (!existingReminder) {
                // Save a new reminder
                const reminder = new Notification({
                    userId,
                    title: 'Appointment Reminder',
                    message: `You have an appointment tomorrow (${appointmentTomorrow.date}) at ${appointmentTomorrow.timeSlot}.`,
                    type: 'info',
                    createdAt: new Date()
                });
                await reminder.save();
                // Add it to our list
                notifications.unshift(reminder);
            }
        }

        // 3. Check if documents were approved or rejected
        const statusDocs = await Document.find({
            userId,
            status: { $in: ['approved', 'rejected'] }
        });

        for (const doc of statusDocs) {
            // Check if we already have a message for this document

            const docTitle = doc.status === 'approved' ? 'Document Approved' : 'Document Rejected';

            // Wait a few seconds to be sure
            const bufferTime = new Date(doc.updatedAt.getTime() - 2000);

            const existingNotification = await Notification.findOne({
                userId,
                title: docTitle,
                message: { $regex: new RegExp(doc.name || doc.fileName) }, // Ensure it matches the specific doc
                createdAt: { $gte: bufferTime } // Notification must be newer than the document update
            });

            if (!existingNotification) {
                // Pick a message based on the status
                let messageBody = '';
                let type = 'info';

                if (doc.status === 'approved') {
                    messageBody = `Your document "${doc.name}" has been approved.`;
                    type = 'success';
                } else if (doc.status === 'rejected') {
                    messageBody = `Your document "${doc.name}" was rejected.`;
                    if (doc.rejectionReason) {
                        messageBody += ` Reason: ${doc.rejectionReason}`;
                    }
                    type = 'error';
                }

                // Make the message
                const newStatusNotif = new Notification({
                    userId,
                    title: docTitle,
                    message: messageBody,
                    type,
                    createdAt: new Date() // Sets creation time to NOW
                });

                await newStatusNotif.save();
                notifications.unshift(newStatusNotif);
            }
        }

        // 4. Check if meetings were confirmed or cancelled
        const statusAppts = await Appointment.find({
            userId,
            status: { $in: ['confirmed', 'cancelled'] }
        });

        for (const apt of statusAppts) {
            const aptTitle = apt.status === 'confirmed' ? 'Appointment Confirmed' : 'Appointment Cancelled';
            const bufferTime = new Date(apt.updatedAt.getTime() - 2000);

            const existingNotification = await Notification.findOne({
                userId,
                title: aptTitle,
                message: { $regex: new RegExp(apt.date) },
                createdAt: { $gte: bufferTime }
            });

            if (!existingNotification) {
                let messageBody = '';
                let type = 'info';

                if (apt.status === 'confirmed') {
                    messageBody = `Your appointment on ${apt.date} at ${apt.timeSlot} has been confirmed.`;
                    type = 'success';
                } else if (apt.status === 'cancelled') {
                    messageBody = `Your appointment on ${apt.date} at ${apt.timeSlot} has been cancelled.`;
                    type = 'warning';
                }

                const newAptNotif = new Notification({
                    userId,
                    title: aptTitle,
                    message: messageBody,
                    type,
                    createdAt: new Date()
                });

                await newAptNotif.save();
                notifications.unshift(newAptNotif);
            }
        }

        // 5. If there are no messages, show a welcome message
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

// Mark one message as read
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

// Mark every message as read
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
