
import { toast } from '@/hooks/use-toast';
import { useSettingsStore } from '@/store/dataStore';
import memoryService from './memoryService';

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

// Get notifications state from settings
const getNotificationsEnabled = () => {
  try {
    return useSettingsStore.getState().settings?.enableNotifications !== false;
  } catch (error) {
    console.error('Error getting notifications enabled state:', error);
    return true; // Default to enabled if can't access settings
  }
};

// Show a toast notification
export const showToast = (
  title: string,
  message: string,
  type: NotificationType = 'info',
  duration: number = 5000
) => {
  // Check if notifications are enabled
  if (!getNotificationsEnabled()) return;

  // Map notification type to toast variant and styling
  const getToastStyle = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          variant: 'default' as const,
          className: 'bg-green-800 text-white border-green-700'
        };
      case 'error':
        return {
          variant: 'destructive' as const
        };
      case 'warning':
        return {
          variant: 'default' as const,
          className: 'bg-yellow-800 text-white border-yellow-700'
        };
      case 'info':
      default:
        return {
          variant: 'default' as const,
          className: 'bg-cyber-dark text-white border-green-500/50'
        };
    }
  };

  const style = getToastStyle(type);

  // Store notification in universal memory
  storeNotification(title, message, type);
  
  // Play notification sound
  playNotificationSound();
  
  // Show toast notification
  toast({
    title,
    description: message,
    duration,
    ...style
  });
};

// Store notification in universal memory for history
const storeNotification = (
  title: string, 
  message: string, 
  type: NotificationType
) => {
  try {
    // Get existing notifications
    const notifications: Notification[] = memoryService.get('notifications') || [];
    
    // Add new notification
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    // Store notifications, limit to 100 recent notifications
    memoryService.set(
      'notifications', 
      [newNotification, ...notifications].slice(0, 100),
      { tags: ['system', 'notifications'] }
    );
  } catch (error) {
    console.error('Failed to store notification:', error);
  }
};

// Show a success notification
export const showSuccess = (title: string, message: string, duration?: number) => {
  showToast(title, message, 'success', duration);
};

// Show an error notification
export const showError = (title: string, message: string, duration?: number) => {
  showToast(title, message, 'error', duration);
};

// Show an info notification
export const showInfo = (title: string, message: string, duration?: number) => {
  showToast(title, message, 'info', duration);
};

// Show a warning notification
export const showWarning = (title: string, message: string, duration?: number) => {
  showToast(title, message, 'warning', duration);
};

// Create a notification sound player
let notificationSound: HTMLAudioElement | null = null;
let soundInitialized = false;

// Initialize notification sound
export const initNotificationSound = () => {
  if (typeof window !== 'undefined' && !soundInitialized) {
    try {
      notificationSound = new Audio('/notification.mp3');
      notificationSound.load(); // Preload the sound
      soundInitialized = true;
    } catch (error) {
      console.error('Failed to initialize notification sound:', error);
    }
  }
};

// Play notification sound
export const playNotificationSound = () => {
  if (!soundInitialized) {
    initNotificationSound();
  }
  
  if (notificationSound && getNotificationsEnabled()) {
    try {
      // Clone the audio to allow multiple sounds to play simultaneously
      const soundClone = notificationSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4; // Reduce volume to 40%
      soundClone.play().catch(() => {
        // Ignore audio play errors (e.g., user hasn't interacted with the page yet)
      });
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }
};

// Modify App.tsx to initialize the notification sound on startup
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initNotificationSound();
  }, 1000);
});

// Get all notifications
export const getAllNotifications = (): Notification[] => {
  return memoryService.get('notifications') || [];
};

// Mark notification as read
export const markNotificationAsRead = (id: string): void => {
  try {
    const notifications: Notification[] = memoryService.get('notifications') || [];
    const updatedNotifications = notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    );
    
    memoryService.set(
      'notifications', 
      updatedNotifications,
      { tags: ['system', 'notifications'] }
    );
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

// Notification service object
const notificationService = {
  showToast,
  showSuccess,
  showError,
  showInfo,
  showWarning,
  initNotificationSound,
  playNotificationSound,
  getAllNotifications,
  markNotificationAsRead
};

export default notificationService;
