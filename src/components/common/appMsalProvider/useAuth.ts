import { getAccessTokenFromMSAL, handleLogin, handleLogout } from '@/msalConfig';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { useCallback } from 'react';

export const useAuth = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const login = useCallback(async () => {
    try {
      handleLogin();
    } catch (error) {
      console.error('[useAuth] Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('[useAuth] Logout failed:', error);
      throw error;
    }
  }, []);

  const getAccessToken = useCallback(async () => {
    try {
      return await getAccessTokenFromMSAL();
    } catch (error) {
      console.error('[useAuth] Get access token failed:', error);
      return null;
    }
  }, []);

  const getActiveAccount = useCallback(() => {
    return instance.getActiveAccount();
  }, [instance]);

  return {
    isAuthenticated,
    login,
    logout,
    getAccessToken,
    getActiveAccount,
    instance,
  };
};


