const Notification = require('../models/Notification');
const User = require('../models/User');

// Send a message to all the admins
async function notifyAdmins(title, message, type = 'info') {
    try {
        // Find all the admins in the system
        const admins = await User.find({ role: 'admin' });

        // Make a message for each admin
        const notifications = admins.map(admin => ({
            userId: admin._id,
            title,
            message,
            type,
            read: false
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        return { success: true, count: notifications.length };
    } catch (error) {
        console.error('Error creating admin notifications:', error);
        return { success: false, error: error.message };
    }
}

// Send a message to one specific person
async function notifyUser(userId, title, message, type = 'info') {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            type,
            read: false
        });

        await notification.save();
        return { success: true, notification };
    } catch (error) {
        console.error('Error creating user notification:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    notifyAdmins,
    notifyUser
};
