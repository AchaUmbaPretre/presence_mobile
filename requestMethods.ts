import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import config from "./config";
import { 
  PersistedRootState, 
  User, 
  RefreshTokenResponse,
  RefreshSubscriber,
  ApiErrorResponse 
} from "./src/types/api.types";

const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

// ===================== TYPES =====================
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ===================== INSTANCES =====================
export const userRequest: AxiosInstance = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

// Instance spéciale pour refresh token
const refreshClient: AxiosInstance = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

// ===================== REFRESH TOKEN MANAGEMENT =====================
// Flag pour éviter les refresh simultanés
let isRefreshing: boolean = false;
let refreshSubscribers: RefreshSubscriber[] = [];

// Ajouter des callbacks à exécuter après refresh
function subscribeTokenRefresh(cb: RefreshSubscriber): void {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

// ===================== UTILS =====================
// Fonction pour récupérer le token depuis localStorage
function getAccessTokenFromStorage(): string | null {
  try {
    const persisted = localStorage.getItem("persist:root");
    if (!persisted) return null;
    
    const parsed: PersistedRootState = JSON.parse(persisted);
    if (!parsed?.user) return null;
    
    const userState = JSON.parse(parsed.user);
    return userState?.currentUser?.accessToken || null;
  } catch (error) {
    console.error("Error parsing storage:", error);
    return null;
  }
}

// Fonction pour mettre à jour le token dans localStorage
function updateAccessTokenInStorage(newToken: string): boolean {
  try {
    const persisted = localStorage.getItem("persist:root");
    if (!persisted) return false;
    
    const parsed: PersistedRootState = JSON.parse(persisted);
    if (!parsed?.user) return false;
    
    const userState = JSON.parse(parsed.user);
    if (!userState?.currentUser) return false;
    
    userState.currentUser.accessToken = newToken;
    parsed.user = JSON.stringify(userState);
    localStorage.setItem("persist:root", JSON.stringify(parsed));
    
    return true;
  } catch (error) {
    console.error("Error updating storage:", error);
    return false;
  }
}

// Fonction de logout
function logout(): void {
  localStorage.removeItem("persist:root");
  window.location.href = "/login";
}

// ===================== REQUEST INTERCEPTOR =====================
userRequest.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  try {
    const token = getAccessTokenFromStorage();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error in request interceptor:", error);
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

// ===================== RESPONSE INTERCEPTOR =====================
userRequest.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (!originalRequest) return Promise.reject(error);

    // Vérifier si c'est une erreur 401 et que la requête n'a pas déjà été retentée
    // et que ce n'est pas une requête de refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      // Si un refresh est déjà en cours, on attend qu'il se termine
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(userRequest(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Appel à l'API de refresh token
        const res = await refreshClient.get<RefreshTokenResponse>("/api/auth/refresh-token");
        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No token received");

        // Mettre à jour le localStorage
        const updateSuccess = updateAccessTokenInStorage(newAccessToken);
        if (!updateSuccess) {
          throw new Error("Failed to update storage");
        }

        // Notifier toutes les requêtes en attente
        onRefreshed(newAccessToken);

        // Mettre à jour la requête originale et la réexécuter
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return userRequest(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // refresh échoué → logout
        logout();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion spécifique des autres erreurs
    if (error.response?.status === 403) {
      console.error("Access forbidden");
      // Optionnel: rediriger vers une page d'accès interdit
    }

    return Promise.reject(error);
  }
);

// ===================== EXPORT DES FONCTIONS UTILES =====================
export const api = {
  get: <T>(url: string, config?: any) => userRequest.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: any) => userRequest.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: any) => userRequest.put<T>(url, data, config),
  delete: <T>(url: string, config?: any) => userRequest.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: any) => userRequest.patch<T>(url, data, config),
};

export default userRequest;