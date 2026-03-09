export interface LoginCredentials {
  username: string;
  password: string;
}

// src/features/auth/types/auth.types.ts
export interface User {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  permissions?: string[];
  scope_sites?: number[];
  scope_departments?: number[];
  scope_terminals?: number[];
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  id_utilisateur: number;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  permissions?: string[];
  scope_sites?: number[];
  scope_departments?: number[];
  scope_terminals?: number[];
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Types de navigation
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

// Modifiez votre type dans le hook
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
} & AuthStackParamList;