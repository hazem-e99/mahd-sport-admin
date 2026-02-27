import axiosClient from '@/axiosClient';
import {
    EventType,
    InteractionRequiredAuthError,
    PublicClientApplication,
    type AuthenticationResult
} from "@azure/msal-browser";
import { Auth_API } from './api/endpoints/auth';
import {
    API_SCOPES,
    AZURE_AD_CONFIG,
    MSAL_CONFIG
} from './constants/auth';
import { CURRENT_ENV_CONFIG } from './constants/environment';
import { MICROSOFT_LOGOUT_URLS } from './constants/urls';

export const msalConfig = {
  auth: {
    clientId: AZURE_AD_CONFIG.CLIENT_ID,
    authority: AZURE_AD_CONFIG.AUTHORITY,
    redirectUri: CURRENT_ENV_CONFIG.REDIRECT_BASE_URL,
  },
  cache: {
    cacheLocation: MSAL_CONFIG.CACHE_LOCATION,
    storeAuthStateInCookie: MSAL_CONFIG.STORE_AUTH_STATE_IN_COOKIE,
  },
};

export const loginRequest = {
  scopes: [API_SCOPES.USER_ACCESS],
};

export const msalInstance = new PublicClientApplication(msalConfig);

export async function initializeMsal() {
  try {
    await msalInstance.initialize();
 
    sessionStorage.removeItem("msal.interaction.status");
    
    const response = await msalInstance.handleRedirectPromise();
    if (response && response.account) {
      msalInstance.setActiveAccount(response.account);
      
      
      sessionStorage.removeItem("hasRedirected");
      sessionStorage.removeItem("msal.interaction.status");
    } 
  } catch (error) {
    console.error("❌ خطأ في معالجة redirect promise:", error);
    sessionStorage.removeItem("msal.interaction.status");
    sessionStorage.removeItem("hasRedirected");
  }

 
  msalInstance.addEventCallback((event) => {
     
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      msalInstance.setActiveAccount(payload.account);
       
      sessionStorage.removeItem("hasRedirected");
      sessionStorage.removeItem("msal.interaction.status");
    }
    
    if (event.eventType === EventType.LOGIN_FAILURE) {
       sessionStorage.removeItem("msal.interaction.status");
      sessionStorage.removeItem("hasRedirected");
    }
  });
}

export const clearAllMSALData = () => {
  try {
     msalInstance.clearCache();
    
    const sessionKeys = [
      "msal.interaction.status",
      "hasRedirected",
      "msal.error",
      "msal.error.description"
    ];
    
    sessionKeys.forEach(key => {
      sessionStorage.removeItem(key);
     });
    
    const localKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('msal')) {
        localKeys.push(key);
      }
    }
    
    localKeys.forEach(key => {
      localStorage.removeItem(key);
     });
    
    document.cookie.split(';').forEach((cookie) => {
      const [name] = cookie.split('=');
      if (name && name.includes('msal')) {
        document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
       }
    });
    
   } catch (error) {
    console.error("❌ خطأ في مسح بيانات MSAL:", error);
  }
};

export async function getAccessTokenFromMSAL(): Promise<string | null> {
  try {
    const account = msalInstance.getActiveAccount();
    if (!account) {
       return null;
    }

    const silentRequest = { ...loginRequest, account };
    const response = await msalInstance.acquireTokenSilent(silentRequest);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
       msalInstance.loginRedirect(loginRequest);
      return null;
    }
    console.error("❌ Error acquiring token:", error);
    return null;
  }
}

export const handleLogin = async () => {
  try {
     
    const interactionStatus = msalInstance.getActiveAccount() || 
                             sessionStorage.getItem("msal.interaction.status");
    
    if (interactionStatus) {
       return;
    }
    
    const activeAccount = msalInstance.getActiveAccount();
    if (activeAccount) {
       return;
    }
    
     
    sessionStorage.removeItem("msal.interaction.status");
    sessionStorage.removeItem("hasRedirected");
    
    await msalInstance.loginRedirect(loginRequest);
     
  } catch (error) {
    console.error("❌ فشل في بدء عملية تسجيل الدخول:", error);
    
    sessionStorage.removeItem("msal.interaction.status");
    sessionStorage.removeItem("hasRedirected");
    
    setTimeout(() => {
       msalInstance.loginRedirect(loginRequest).catch((e) => {
        console.error(`❌ فشل في إعادة المحاولة: ${e}`);
      });
    }, 1000);
  }
};

export const handleLogout = async () => {
  const logoutUrl = `${MICROSOFT_LOGOUT_URLS.HAPPY_TENANT}?post_logout_redirect_uri=${CURRENT_ENV_CONFIG.LOGOUT_REDIRECT_URI}`;

  try {
    const res = await axiosClient.post(Auth_API.logout);
    if (res.status === 200) {
      console.log('✅ Backend logout successful');
    } else {
      console.warn('⚠️ Unexpected logout response:', res.status);
    }
  } catch (error) {
    console.error('❌ Backend logout failed:', error);
  }

  try {
    msalInstance.clearCache();

    const clearTokens = () => {
      const removeMatchingKeys = (storage: Storage) => {
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && (key.includes('msal') || key.includes('token') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => {
          storage.removeItem(key);
         });
      };

      removeMatchingKeys(localStorage);
      removeMatchingKeys(sessionStorage);

      document.cookie.split(';').forEach((cookie) => {
        const [name] = cookie.split('=');
        if (name && (name.includes('msal') || name.includes('token') || name.includes('auth'))) {
          document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
         }
      });
    };

    clearTokens();
  } catch (cleanError) {
    console.error('⚠️ Error during local cleanup', cleanError);
  }

  window.location.href = logoutUrl;
};
