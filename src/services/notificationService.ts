
/**
 * Notification sound service
 * This service handles the sound notifications and toast notifications in the app
 */

import { useToast, toast } from "@/hooks/use-toast";
import { useNotifications } from "@/components/NotificationProvider";

let notificationSound: HTMLAudioElement | null = null;

export function initNotificationSound() {
  try {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      notificationSound = new Audio('/notification.mp3');
      notificationSound.preload = 'auto';
      console.log('Notification sound initialized');
    }
  } catch (error) {
    console.error('Failed to initialize notification sound:', error);
  }
}

export function playNotificationSound() {
  try {
    if (notificationSound) {
      notificationSound.currentTime = 0; // Reset to start to allow rapid consecutive plays
      notificationSound.play().catch(error => {
        console.warn('Failed to play notification sound:', error);
      });
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
}

// Add toast notification functions
export function showSuccess(title: string, message: string) {
  toast({
    title,
    description: message,
    className: "bg-green-800 text-white border-green-700",
  });
}

export function showError(title: string, message: string) {
  toast({
    title,
    description: message,
    variant: "destructive",
  });
}

export function showInfo(title: string, message: string) {
  toast({
    title,
    description: message,
    className: "bg-cyber-dark text-white border-green-500/50",
  });
}

export function showWarning(title: string, message: string) {
  toast({
    title,
    description: message,
    className: "bg-yellow-800 text-white border-yellow-700",
  });
}

// Default export for backward compatibility
const notificationService = {
  initNotificationSound,
  playNotificationSound,
  showSuccess,
  showError,
  showInfo,
  showWarning
};

export default notificationService;
