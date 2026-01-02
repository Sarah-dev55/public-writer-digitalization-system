const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create notification for all admin users
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, success, warning, error)
 */
async function notifyAdmins(title, message, type = 'info') {
    try {
        // Find all admin users
        const admins = await User.find({ role: 'admin' });
        
        // Create notifications for each admin
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

/**
 * Create notification for a specific user
 * @param {string} userId - User ID
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {string} type - Notification type (info, success, warning, error)
 */
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
