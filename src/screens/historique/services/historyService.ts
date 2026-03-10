import { api } from '@/api/client';
import { HistoryItems, HistoryFilters, HistoryStats } from '../types/history.types';

class HistoryService {
  private static instance: HistoryService;

  static getInstance(): HistoryService {
    if (!HistoryService.instance) {
      HistoryService.instance = new HistoryService();
    }
    return HistoryService.instance;
  }

  async getHistory(userId: number, filters?: HistoryFilters): Promise<HistoryItems[]> {
    try {
      const response = await api.get(`/api/presences/${userId}`, {
        params: {
          startDate: filters?.startDate,
          endDate: filters?.endDate,
          status: filters?.status?.join(','),
          search: filters?.search,
          sortBy: filters?.sortBy,
          sortOrder: filters?.sortOrder,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      throw error;
    }
  }

  async getHistoryStats(userId: number, period?: string): Promise<HistoryStats> {
    try {
      const response = await api.get(`/api/presences/${userId}/stats`, {
        params: { period },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      throw error;
    }
  }

  async exportHistory(userId: number, format: 'pdf' | 'excel' = 'pdf'): Promise<string> {
    try {
      const response = await api.get(`/api/presences/${userId}/export`, {
        params: { format },
        responseType: 'blob',
      });
      
      // Créer un URL pour le téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historique_${new Date().toISOString()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return `Historique exporté au format ${format}`;
    } catch (error) {
      console.error('Erreur export:', error);
      throw error;
    }
  }
}

export const historyService = HistoryService.getInstance();