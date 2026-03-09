import { api } from './../../../api/client';
import { LoginCredentials, LoginResponse, User } from '../types/auth.types';
import { API_ENDPOINTS } from '@/api/endpoints';

class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<{ accessToken: string; user: User }> {
    try {
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN, 
        credentials
      );
      
      const data = response.data;
      
      // Vérifier si la connexion a réussi
      if (!data.success) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      // Construire l'objet user
      const user: User = {
        id: data.id_utilisateur,
        email: data.email,
        nom: data.nom || '',
        prenom: data.prenom || '',
        role: data.role || 'user',
        permissions: data.permissions || [],
        scope_sites: data.scope_sites || [],
        scope_departments: data.scope_departments || [],
        scope_terminals: data.scope_terminals || []
      };

      return {
        accessToken: data.accessToken,
        user
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const response = await api.post<{ accessToken: string }>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || 'Erreur serveur';
      return new Error(message);
    }
    if (error.request) {
      return new Error('Erreur réseau');
    }
    return new Error('Erreur inconnue');
  }
}

export const authService = AuthService.getInstance();