/**
 * Utility for handling geolocation with fallbacks
 */

interface GeolocationData {
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  error?: string;
}

/**
 * Get geolocation data with fallbacks
 * This function tries multiple geolocation services and falls back gracefully
 */
export const getGeolocation = async (): Promise<GeolocationData> => {
  // List of geolocation API endpoints to try
  const geoApis = [
    'https://ipapi.co/json/',
    'https://ipinfo.io/json',
    'https://api.ipify.org?format=json'
  ];
  
  let error = '';
  
  // Try each API in sequence until one works
  for (const api of geoApis) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(api, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Return the data in a standardized format
      return {
        ip: data.ip,
        country: data.country || data.country_name,
        city: data.city,
        region: data.region || data.region_name,
        timezone: data.timezone
      };
    } catch (err) {
      error = err.message;
      console.log(`Geolocation API ${api} failed: ${err.message}`);
      // Continue to the next API
    }
  }
  
  // If all APIs fail, return an object with the error
  return {
    error: `Failed to get geolocation data: ${error}`
  };
};

/**
 * Simple function to check if we're online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

export default {
  getGeolocation,
  isOnline
};
