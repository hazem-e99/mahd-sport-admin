
export * from './auth';
export * from './environment';
export * from './urls';

// Re-export commonly used constants for convenience
export {
    API_SCOPES, AUTH_HEADERS, AZURE_AD_CONFIG, MSAL_CONFIG
} from './auth';

export { DEVELOPMENT_URLS, MICROSOFT_LOGOUT_URLS, PRODUCTION_URLS } from './urls';

export {
    CURRENT_ENV, CURRENT_ENV_CONFIG, ENVIRONMENT, ENV_CONFIG, FEATURE_FLAGS
} from './environment';

