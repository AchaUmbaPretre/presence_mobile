import { AUTH_MESSAGES } from "./../screens/users/constants/auth.constants";

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  request?: any;
  message: string;
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Erreur de réponse du serveur
    const status = error.response.status;
    const message = error.response.data?.message;

    switch (status) {
      case 400:
        return message || "Requête invalide";
      case 401:
        return AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS;
      case 403:
        return "Accès interdit";
      case 404:
        return "Ressource non trouvée";
      case 500:
        return AUTH_MESSAGES.ERROR.SERVER_ERROR;
      default:
        return message || AUTH_MESSAGES.ERROR.SERVER_ERROR;
    }
  }

  if (error.request) {
    // Pas de réponse du serveur
    return AUTH_MESSAGES.ERROR.NETWORK_ERROR;
  }

  // Autre erreur
  return error.message || AUTH_MESSAGES.ERROR.SERVER_ERROR;
};

export const isNetworkError = (error: any): boolean => {
  return !error.response && !!error.request;
};

export const isAuthError = (error: any): boolean => {
  return error.response?.status === 401;
};
