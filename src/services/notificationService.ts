
/**
 * Notification sound service
 * This service handles the sound notifications in the app
 */

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
