import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axiosClient from '@/axiosClient';
import { Auth_API } from '@/api/endpoints';

interface User {
    canAccessAdmin?: boolean;
    permissions?: string[];
    name?: string;
    email?: string;
    [key: string]: any;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    isStale: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Configuration
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isStale, setIsStale] = useState(false);

    const fetchedRef = useRef(false);
    const timestampRef = useRef<number>(0);

    const fetchUser = useCallback(async (retryCount = 0): Promise<void> => {
        try {
            console.log('🔄 Fetching user data from API...');
            const response = await axiosClient.get(Auth_API.getCurrentUser);
            const userData = response.data?.data || null;

            setUser(userData);
            setError(null);
            timestampRef.current = Date.now();

            console.log('✅ User data fetched successfully:', userData);
        } catch (err) {
            const fetchError = err instanceof Error ? err : new Error('Failed to fetch user');
            console.error('❌ Error fetching user:', fetchError);

            if (retryCount < MAX_RETRIES) {
                console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
                return fetchUser(retryCount + 1);
            }

            setError(fetchError);
            setUser(null);
            console.error('❌ Max retries reached.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refetch = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        await fetchUser();
    }, [fetchUser]);

    // Initial fetch - only once!
    useEffect(() => {
        if (fetchedRef.current) {
            console.log('📦 Already fetched, skipping...');
            return;
        }

        fetchedRef.current = true;
        console.log('🚀 Initial user fetch starting...');
        fetchUser();
    }, [fetchUser]);

    // Check for stale data periodically
    useEffect(() => {
        const checkStale = () => {
            if (timestampRef.current > 0) {
                const age = Date.now() - timestampRef.current;
                setIsStale(age > STALE_TIME);
            }
        };

        const interval = setInterval(checkStale, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const value = useMemo(() => ({
        user,
        isLoading,
        error,
        refetch,
        isStale,
    }), [user, isLoading, error, refetch, isStale]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * Hook to access user data - must be used inside UserProvider
 */
export const useCurrentUser = (): UserContextType => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useCurrentUser must be used within a UserProvider');
    }

    return context;
};

/**
 * Clear user data (for logout)
 */
export const clearUserCache = (): void => {
    console.log('🗑️ User cache cleared');
    // This will be handled by the provider re-mounting after logout
};
