import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification } from './ui/notification';
import { v4 as uuidv4 } from 'uuid';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  showNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  dismissNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback(
    (title: string, message: string, type: NotificationType = 'info', duration = 5000) => {
      const id = uuidv4();
      setNotifications((prev) => [...prev, { id, title, message, type, duration }]);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, dismissNotification }}
    >
      {children}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <Notification
            key={notification.id}
            title={notification.title}
            message={notification.message}
            variant={notification.type}
            position="top-right"
            duration={notification.duration}
            onClose={() => dismissNotification(notification.id)}
            style={{ marginTop: `${index * 4}rem` }}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
