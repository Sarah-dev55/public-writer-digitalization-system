import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LogOut, Bell } from 'lucide-react';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/notificationService';

export default function AdminHeader({ title = 'Dashboard', breadcrumb = ['Homepage', 'Dashboard'] }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(userId);
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;



  return (
    <header className="w-full fixed top-0 left-0 z-30 bg-app-primary">
      <div className="max-w-full mx-auto px-6 text-app-accent">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-app-secondary rounded-md flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16v12H4z" fill="#fff" opacity="0.04" />
              </svg>
            </div>

            <div>
              <div className="text-sm opacity-90">{title}</div>
              <div className="text-xs opacity-70">{breadcrumb.join(' > ')}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-white/10 relative transition-colors" 
                aria-label="notifications"
              >
                <Bell className="w-5 h-5 text-app-accent" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-xl bg-white z-50">
                  <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-app-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-app-secondary hover:text-app-primary transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => handleMarkAsRead(notif._id)}
                          className={`p-3 hover:bg-gray-50 cursor-pointer ${
                            !notif.read ? 'bg-app-secondary/10' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {!notif.read && (
                              <div className="w-2 h-2 bg-app-secondary rounded-full mt-2"></div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-full hover:bg-white/10 flex items-center gap-2 transition-colors"
                aria-label="user menu"
              >
                <div className="w-8 h-8 bg-app-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-app-primary/95 backdrop-blur">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-app-accent">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-app-accent/80">{user?.email || 'admin@example.com'}</p>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
