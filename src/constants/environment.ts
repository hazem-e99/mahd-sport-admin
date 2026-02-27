
export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
} as const;

// Current Environment
export const CURRENT_ENV = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || ENVIRONMENT.DEVELOPMENT;

// Environment Configuration from .env files
export const ENV_CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/",
  API_BASE_URL: import.meta.env.VITE_BASE_URL ? `${import.meta.env.VITE_BASE_URL}/api` : "http://23.254.129.173/api",
  SIGNALR_HUB_URL: import.meta.env.VITE_SIGNALR_HUB_URL || "http://23.254.129.173/notifications",
  REDIRECT_BASE_URL: import.meta.env.VITE_REDIRECT_BASE_URL || "http://localhost:3000/",
  LOGOUT_URL: import.meta.env.VITE_LOGOUT_URL || "https://localhost:3001/logout-success",
  LOGOUT_REDIRECT_URI: import.meta.env.VITE_REDIRECT_BASE_URL || "http://localhost:3000/",
} as const;

// Current Environment Config (for backward compatibility)
export const CURRENT_ENV_CONFIG = ENV_CONFIG;

export const FEATURE_FLAGS = {
  ENABLE_MSAL_LOGGING: CURRENT_ENV === ENVIRONMENT.DEVELOPMENT,
  ENABLE_DEBUG_MODE: CURRENT_ENV === ENVIRONMENT.DEVELOPMENT,
  ENABLE_ERROR_REPORTING: CURRENT_ENV === ENVIRONMENT.PRODUCTION,
} as const;

