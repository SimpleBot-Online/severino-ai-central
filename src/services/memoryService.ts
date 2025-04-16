
/**
 * Universal Memory Service
 * Provides persistent storage capabilities across the application
 */

// Define memory item structure
interface MemoryItem<T = any> {
  key: string;
  value: T;
  timestamp: number;
  expiry?: number; // Optional expiration time in milliseconds
  tags?: string[]; // Optional tags for categorization
}

const STORAGE_PREFIX = 'severino-memory-';

class MemoryService {
  private memoryCache: Map<string, MemoryItem> = new Map();
  
  constructor() {
    this.initializeFromLocalStorage();
    
    // Set up periodic cleanup for expired items
    setInterval(() => this.cleanupExpired(), 60000); // Run every minute
  }
  
  /**
   * Initialize memory cache from localStorage
   */
  private initializeFromLocalStorage(): void {
    try {
      // Get all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const memoryKey = key.replace(STORAGE_PREFIX, '');
          const serialized = localStorage.getItem(key);
          
          if (serialized) {
            const memoryItem: MemoryItem = JSON.parse(serialized);
            this.memoryCache.set(memoryKey, memoryItem);
          }
        }
      }
      
      console.log(`Memory service initialized with ${this.memoryCache.size} items`);
    } catch (error) {
      console.error('Failed to initialize memory from localStorage:', error);
    }
  }
  
  /**
   * Set a value in memory
   * @param key Unique identifier
   * @param value Any value to store
   * @param options Optional configuration (expiry, tags)
   */
  set<T>(key: string, value: T, options: { expiry?: number; tags?: string[] } = {}): void {
    const memoryItem: MemoryItem<T> = {
      key,
      value,
      timestamp: Date.now(),
      ...options
    };
    
    // Store in memory cache
    this.memoryCache.set(key, memoryItem);
    
    // Persist to localStorage
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${key}`, 
        JSON.stringify(memoryItem)
      );
    } catch (error) {
      console.error(`Failed to persist memory item '${key}' to localStorage:`, error);
    }
  }
  
  /**
   * Get a value from memory
   * @param key Unique identifier
   * @returns The stored value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const memoryItem = this.memoryCache.get(key);
    
    if (!memoryItem) {
      return undefined;
    }
    
    // Check if the item has expired
    if (memoryItem.expiry && Date.now() > memoryItem.timestamp + memoryItem.expiry) {
      this.remove(key);
      return undefined;
    }
    
    return memoryItem.value as T;
  }
  
  /**
   * Remove a value from memory
   * @param key Unique identifier
   */
  remove(key: string): void {
    this.memoryCache.delete(key);
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  }
  
  /**
   * Clear all memory items
   */
  clear(): void {
    this.memoryCache.clear();
    
    // Remove only memory items from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
  
  /**
   * Find memory items by tag
   * @param tag Tag to search for
   * @returns Array of memory items with the specified tag
   */
  findByTag<T>(tag: string): T[] {
    const results: T[] = [];
    
    this.memoryCache.forEach((item) => {
      if (item.tags && item.tags.includes(tag)) {
        // Check expiry
        if (!item.expiry || Date.now() <= item.timestamp + item.expiry) {
          results.push(item.value as T);
        }
      }
    });
    
    return results;
  }
  
  /**
   * Remove expired memory items
   */
  private cleanupExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    this.memoryCache.forEach((item, key) => {
      if (item.expiry && now > item.timestamp + item.expiry) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.remove(key));
    
    if (expiredKeys.length > 0) {
      console.log(`Memory service cleaned up ${expiredKeys.length} expired items`);
    }
  }
  
  /**
   * Get all memory items (for debugging)
   */
  debug(): Record<string, MemoryItem> {
    const debug: Record<string, MemoryItem> = {};
    this.memoryCache.forEach((value, key) => {
      debug[key] = value;
    });
    return debug;
  }
}

// Create singleton instance
const memoryService = new MemoryService();

export default memoryService;
