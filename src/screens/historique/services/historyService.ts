import { api } from '@/api/client';
import { HistoryFilters, HistoryStats, HistoryResponse, HistoryItems } from '../types/history.types';

class HistoryService {
  private static instance: HistoryService;

  static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  /**
   * Récupère l'historique des présences d'un utilisateur
   */
  async getHistory(userId: number, filters?: HistoryFilters): Promise<HistoryResponse> {
    try {
      // Construction des paramètres de requête
      const params: any = {
        userId,
        page: filters?.page || 1,
        limit: filters?.limit || 20,
      };

      if (filters?.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters?.endDate) {
        params.endDate = filters.endDate;
      }
      if (filters?.status && filters.status.length > 0) {
        params.status = filters.status.join(',');
      }

      const response = await api.get('/api/presence/historiqueById', { params });
      
      // Adapter la réponse de l'API au format attendu par le frontend
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Erreur lors du chargement');
      }

      return {
        historique: apiResponse.data.historique.map((item: any) => ({
          id: item.id,
          date: item.date,
          heure_entree: item.heure_entree,
          heure_sortie: item.heure_sortie,
          retard_minutes: item.retard_minutes,
          heures_supplementaires: item.heures_supplementaires,
          statut: item.statut,
          source: item.source,
          is_locked: item.is_locked,
          terminal: item.terminal,
          site: item.site,
          details: item.details
        })),
        stats: {
          total_jours: apiResponse.data.stats.total_jours,
          total_presents: apiResponse.data.stats.total_presents,
          total_absents: apiResponse.data.stats.total_absents,
          total_retards: apiResponse.data.stats.total_retards,
          total_heures_supp: apiResponse.data.stats.total_heures_supp,
          moyenne_heures: apiResponse.data.stats.moyenne_heures,
          total_retard_minutes: apiResponse.data.stats.total_retard_minutes,
          objectif_hebdo: apiResponse.data.stats.objectif_hebdo,
          objectif_atteint: apiResponse.data.stats.objectif_atteint,
          sites_visites: apiResponse.data.stats.sites_visites,
          derniere_presence: apiResponse.data.stats.derniere_presence,
          repartition: apiResponse.data.stats.repartition
        },
        pagination: apiResponse.pagination
      };
    } catch (error) {
      console.error('❌ Erreur chargement historique:', error);
      throw error;
    }
  }

  /**
   * Récupère uniquement les statistiques
   */
  async getHistoryStats(userId: number, filters?: { startDate?: string; endDate?: string }): Promise<HistoryStats> {
    try {
      const params: any = { userId };
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      const response = await api.get('/api/presence/historiqueStats', { params });
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Erreur lors du chargement des stats');
      }

      return apiResponse.data.stats;
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
      throw error;
    }
  }

  /**
   * Récupère les détails d'une présence spécifique
   */
  async getPresenceDetail(presenceId: number): Promise<HistoryItems> {
    try {
      const response = await api.get(`/api/presence/${presenceId}`);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Erreur lors du chargement');
      }

      return apiResponse.data;
    } catch (error) {
      console.error('❌ Erreur chargement détail:', error);
      throw error;
    }
  }

  /**
   * Exporte l'historique (version mobile - partage)
   */
  async exportHistory(userId: number, format: 'pdf' | 'csv' = 'pdf'): Promise<string> {
    try {
      const response = await api.get(`/api/presence/export/${userId}`, {
        params: { format },
        responseType: 'blob',
      });
      
      // Pour React Native, on retourne l'URL du blob
      // À utiliser avec FileSystem de Expo
      const blob = response.data;
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('❌ Erreur export:', error);
      throw error;
    }
  }

  /**
   * Récupère les mois disponibles dans l'historique
   */
  async getAvailableMonths(userId: number): Promise<string[]> {
    try {
      const response = await api.get(`/api/presence/months/${userId}`);
      
      const apiResponse = response.data;
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Erreur lors du chargement');
      }

      return apiResponse.data;
    } catch (error) {
      console.error('❌ Erreur chargement mois:', error);
      throw error;
    }
  }
}

export const historyService = HistoryService.getInstance();