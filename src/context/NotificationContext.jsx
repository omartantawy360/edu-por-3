import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const uuidv4 = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('educomp_notifications');
    if (saved) return JSON.parse(saved);
    
    // Initial mock notifications
    return [
      { id: '1', title: 'Welcome to EduComp!', message: 'Explore the new competition management features in your dashboard.', type: 'info', date: '2026-03-28T10:00:00Z', read: false },
      { id: '2', title: 'System Update', message: 'The platform has been upgraded to support professional competition lifecycles.', type: 'success', date: '2026-03-27T14:30:00Z', read: true },
      { id: '3', title: 'Registration Deadline', message: 'The AI Programming Championship registration period is ending soon.', type: 'warning', date: '2026-03-26T09:15:00Z', read: true },
    ];
  });

  useEffect(() => {
    localStorage.setItem('educomp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  /**
   * Add a new notification
   * @param {Object} notification - Notification data
   * @param {string} notification.title - Headline
   * @param {string} notification.message - Content
   * @param {'info' | 'success' | 'warning' | 'error'} [notification.type] - Visual style
   * @param {string} [notification.link] - Action link
   */
  const addNotification = (notification) => {
    const newNotification = {
      id: uuidv4(),
      date: new Date().toISOString(),
      read: false,
      type: 'info',
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
