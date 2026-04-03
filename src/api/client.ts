import { tokenManager } from "@/utils/tokenManager";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import config from "config";
import { isAuthError } from "./../utils/errorHandler";
import { API_ENDPOINTS } from "./endpoints";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

// Configuration du client axios
export const api: AxiosInstance = axios.create({
  baseURL: DOMAIN,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Variables pour le refresh token
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Intercepteur de requête
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenManager.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      !originalRequest ||
      originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      return Promise.reject(error);
    }

    if (isAuthError(error) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await api.post(
          API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        );
        const { accessToken } = refreshResponse.data;

        await tokenManager.setToken(accessToken);
        onRefreshed(accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        await tokenManager.clearToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
