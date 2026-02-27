
export const PRODUCTION_URLS = {
  BASE_URL: "https://my.mahd.gov.sa/",
  API_BASE_URL: "https://api.mahd.gov.sa",
  LOGOUT_REDIRECT_URI: "https://my.mahd.gov.sa/logout-success",
} as const;


export const DEVELOPMENT_URLS = {
  BASE_URL: "http://localhost:3000/",
  API_BASE_URL: "http://23.254.129.173/api",
  LOGOUT_REDIRECT_URI: "https://localhost:3000/logout-success",
} as const;


export const MICROSOFT_LOGOUT_URLS = {
  HAPPY_TENANT: "https://login.microsoftonline.com/4dab9820-0fa6-41e0-807f-3a658b222410/oauth2/v2.0/logout",
  MAHD_TENANT: "https://login.microsoftonline.com/6a4c7ca7-63ce-4415-ab42-4b5b08e5fd99/oauth2/v2.0/logout",
} as const;

