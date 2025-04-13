/**
 * Database initialization service
 * This service handles the initialization of the database structure
 */

// Function to check and create database structure
export async function checkAndCreateDatabaseStructure() {
  try {
    // Verify if the Zustand stores are initialized
    const stores = [
      'severino-notes-storage',
      'severino-tasks-storage',
      'severino-links-storage',
      'severino-ideas-storage',
      'severino-prompts-storage',
      'severino-chip-instances-storage',
      'severino-settings-storage',
      'severino-auth-storage',
      'severino-clients-storage',
      'severino-financial-records-storage'
    ];

    // Check if each store exists in localStorage
    stores.forEach(storeName => {
      if (!localStorage.getItem(storeName)) {
        // Initialize empty store to ensure it exists
        localStorage.setItem(storeName, JSON.stringify({ state: {} }));
      }
    });

    // Simulate a small delay to give time to load
    await new Promise(resolve => setTimeout(resolve, 300));

    return true;
  } catch (error) {
    console.error('Error checking and creating database structure:', error);
    return false;
  }
}
