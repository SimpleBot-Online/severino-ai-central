
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification } from './ui/notification';
import { v4 as uuidv4 } from 'uuid';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
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
  dismissAllNotifications: () => void;
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'severino-notifications';

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<NotificationItem[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        // Make sure timestamps are Date objects
        const reformattedNotifications = parsed.map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(reformattedNotifications);
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to localStorage:', error);
    }
  }, [notifications]);

  const showNotification = useCallback(
    (title: string, message: string, type: NotificationType = 'info', duration = 5000) => {
      const id = uuidv4();
      const newNotification: NotificationItem = { 
        id, 
        title, 
        message, 
        type, 
        timestamp: new Date(),
        read: false,
        duration 
      };
      
      // Add to persistent notifications
      setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Limit to 50 notifications
      
      // Also show as a toast
      setToasts(prev => [...prev, newNotification]);
      
      // Play notification sound
      try {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio notification error:', e));
      } catch (e) {
        console.log('Failed to play notification sound');
      }
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    setToasts((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const dismissAllNotifications = useCallback(() => {
    setToasts([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  }, []);

  return (
    <NotificationContext.Provider
      value={{ 
        notifications, 
        showNotification, 
        dismissNotification, 
        dismissAllNotifications,
        markAsRead
      }}
    >
      {children}
      <div className="notification-container">
        {toasts.map((notification, index) => (
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
