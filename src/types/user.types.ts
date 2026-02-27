/**
 * Type definitions for user-related data structures
 */

/**
 * User object returned from the API
 */
export interface User {
  /** User's unique identifier */
  id?: string;
  
  /** User's display name */
  name?: string;
  
  /** User's email address */
  email?: string;
  
  /** Whether the user can access the admin panel */
  canAccessAdmin?: boolean;
  
  /** List of permissions assigned to the user */
  permissions?: string[];
  
  /** User's role(s) */
  roles?: string[];
  
  /** Additional user properties */
  [key: string]: any;
}

/**
 * Return type of the useCurrentUser hook
 */
export interface UseCurrentUserReturn {
  /** The current user data, or null if not loaded */
  user: User | null;
  
  /** True while fetching user data */
  isLoading: boolean;
  
  /** Error object if fetch failed, null otherwise */
  error: Error | null;
  
  /** Function to manually refetch user data */
  refetch: () => Promise<void>;
  
  /** True if cached data is older than STALE_TIME */
  isStale: boolean;
}

/**
 * Internal cache entry structure
 */
export interface CacheEntry {
  /** Cached user data */
  data: User | null;
  
  /** Timestamp when data was cached */
  timestamp: number;
  
  /** Error from last fetch attempt */
  error: Error | null;
}
