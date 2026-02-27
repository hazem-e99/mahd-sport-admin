// MSAL Configuration from environment variables
export const AZURE_AD_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_MSAL_CLIENT_ID || "74925b22-66ce-42a1-bab3-fd4f8bdcff5c",
  AUTHORITY: import.meta.env.VITE_MSAL_AUTHORITY || "https://login.microsoftonline.com/4dab9820-0fa6-41e0-807f-3a658b222410",
  get TENANT_ID() {
    // Extract tenant ID from authority URL
    const match = this.AUTHORITY.match(/\/([a-f0-9-]+)$/);
    return match ? match[1] : "4dab9820-0fa6-41e0-807f-3a658b222410";
  },
} as const;

// API Scopes from environment variables
export const API_SCOPES = {
  USER_ACCESS: import.meta.env.VITE_MSAL_SCOPES || "api://74925b22-66ce-42a1-bab3-fd4f8bdcff5c/access_as_user",
} as const;


export const MSAL_CONFIG = {
  CACHE_LOCATION: "localStorage" as const,
  STORE_AUTH_STATE_IN_COOKIE: true,
} as const;


export const AUTH_HEADERS = {
  AUTHORIZATION_PREFIX: "Bearer",
  ACCEPT_LANGUAGE: "Accept-Language",
} as const;