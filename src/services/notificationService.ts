import { toast } from '@/components/ui/use-toast';
import { useSettingsStore } from '@/store/dataStore';

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
  return useSettingsStore.getState().settings.enableNotifications;
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

  // Show toast notification
  toast({
    title,
    description: message,
    duration,
    ...style
  });
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

// Initialize notification sound
export const initNotificationSound = () => {
  if (typeof window !== 'undefined') {
    notificationSound = new Audio('/notification.mp3');
  }
};

// Play notification sound
export const playNotificationSound = () => {
  if (notificationSound && getNotificationsEnabled()) {
    notificationSound.play().catch(() => {
      // Ignore audio play errors (e.g., user hasn't interacted with the page yet)
    });
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
  playNotificationSound
};

export default notificationService;
