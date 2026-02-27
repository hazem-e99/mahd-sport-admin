import { CURRENT_ENV_CONFIG } from "@/constants/environment";
// Authentication disabled - removed MSAL import
import axios from "axios";
import { getAccessTokenFromMSAL } from "./msalConfig";

const BASE_URL = CURRENT_ENV_CONFIG.API_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User_Type ": "Admin",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Authentication disabled - no token required
      const accessToken = await getAccessTokenFromMSAL();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      const lang = localStorage.getItem('language') || 'ar';
      config.headers['Accept-Language'] = lang;

     } catch (error) {
      console.error("❌ Error in request interceptor:", error);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
     return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("🔒 Unauthorized - Token might be expired");
    }
    
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error);
    return Promise.reject(error);
  }
);

export default apiClient;