/**
 * Utilities for working with localStorage
 */

/**
 * Check if localStorage is accessible in the current environment
 * @returns True if localStorage can be read/written
 */
export function canAccessLocalStorage(): boolean {
  try {
    localStorage.getItem('test');
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Safe localStorage getter that handles errors
 * @param key - Key to retrieve from localStorage
 * @returns Value or null if not found or error occurs
 */
export function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error('Error accessing localStorage:', err);
    return null;
  }
}

/**
 * Safe localStorage setter that handles errors
 * @param key - Key to set in localStorage
 * @param value - Value to store
 * @returns True if successful
 */
export function setLocalStorageItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.error('Error setting localStorage item:', err);
    return false;
  }
}

/**
 * Safe localStorage remove that handles errors
 * @param key - Key to remove from localStorage
 * @returns True if successful
 */
export function removeLocalStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error('Error removing localStorage item:', err);
    return false;
  }
}