export interface User {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface PersistedUserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface PersistedRootState {
  user: string; // JSON stringified PersistedUserState
  // autres reducers...
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export type RefreshSubscriber = (token: string) => void;

// Types pour les réponses d'erreur
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}
