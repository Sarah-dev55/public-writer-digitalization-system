import api from './api';

/**
 * Fetch all notifications for a user
 * @param {string} userId
 */
export async function getUserNotifications(userId) {
    try {
        const response = await api.get(`/client/notifications/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

/**
 * Mark a notification as read
 * @param {string} id - Notification ID
 */
export async function markNotificationAsRead(id) {
    try {
        const response = await api.put(`/client/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
}

/**
 * Mark ALL notifications as read
 * @param {string} userId
 */
export async function markAllNotificationsAsRead(userId) {
    try {
        const response = await api.put(`/client/notifications/user/${userId}/read-all`);
        return response.data;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        throw error;
    }
}
