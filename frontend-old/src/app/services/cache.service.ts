import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /**
   * Stores data in the cache using localStorage.
   * Supports nested keys with arrays (e.g., ["key1", "key2", "key3"]).
   * @param keys An array of strings representing the path of keys.
   * @param entry The data to store in the cache.
   */
  set(keys: string[], entry: any): void {
    // Retrieve the existing cache for the given key, or initialize it if it doesn't exist
    const primaryKey = keys[0];
    const existingCache = localStorage.getItem(primaryKey);
    let cache = existingCache ? JSON.parse(existingCache) : {};

    if (keys.length > 1) {
      // Use the array of keys to traverse the cache object
      let currentLevel = cache;
      for (let i = 1; i < keys.length - 1; i++) {
        // Create the next level object if it doesn't exist
        if (!currentLevel[keys[i]]) {
          currentLevel[keys[i]] = {};
        }
        currentLevel = currentLevel[keys[i]];
      }

      // Set the final value at the last level
      currentLevel[keys[keys.length - 1]] = entry;
    } else {
      // If no nested keys, store the entry directly under the primary key
      cache = entry;
    }

    // Convert the updated cache to a JSON string and store it in localStorage
    const stringifiedCache = JSON.stringify(cache);
    localStorage.setItem(primaryKey, stringifiedCache);
  }

  /**
   * Retrieves data from the cache.
   * @param keys An array of strings representing the path of keys.
   * @returns The stored data or `null` if the key doesn't exist or is invalid.
   */
  get(keys: string[]): any {
    // Retrieve the raw JSON string from localStorage for the main key
    const primaryKey = keys[0];
    const rawEntry = localStorage.getItem(primaryKey);

    // If the key is not found, return null
    if (!rawEntry) {
      return null;
    }

    // Parse the JSON string into an object
    const parsedEntry = JSON.parse(rawEntry);

    if (keys.length > 1) {
      // Use the array of keys to traverse the cache object
      let currentLevel = parsedEntry;
      for (let i = 1; i < keys.length; i++) {
        if (currentLevel[keys[i]] !== undefined) {
          currentLevel = currentLevel[keys[i]];
        } else {
          return null;
        }
      }
      return currentLevel;
    }

    // If no nested keys, return the entire object stored under the primary key
    return parsedEntry;
  }

  /**
   * Clears all data stored in the cache.
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}
