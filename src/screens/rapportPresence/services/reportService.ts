import { api } from '@/api/client';
import { ReportFilters, ReportStats, ReportFormat, ReportPeriod } from '../types/report.types';
import { MOCK_REPORT_STATS } from '../constants/report.constants';

class ReportService {
  private static instance: ReportService;

  static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async getReportStats(filters: ReportFilters): Promise<ReportStats> {
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En développement, retourner des données mockées
      return {
        ...MOCK_REPORT_STATS,
        period: this.getPeriodLabel(filters.period),
      };
      
      /* Appel API réel
      const response = await api.get('/api/reports/stats', { params: filters });
      return response.data;
      */
    } catch (error) {
      console.error('❌ Erreur chargement rapport:', error);
      throw error;
    }
  }

  async exportReport(filters: ReportFilters, format: ReportFormat): Promise<string> {
    try {
      // Simulation d'export
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `Rapport exporté au format ${format}`;
      
      /* Appel API réel
      const response = await api.get('/api/reports/export', {
        params: { ...filters, format },
        responseType: 'blob',
      });
      return response.data;
      */
    } catch (error) {
      console.error('❌ Erreur export rapport:', error);
      throw error;
    }
  }

  private getPeriodLabel(period: ReportPeriod): string {
    const now = new Date();
    switch (period) {
      case 'day': return now.toLocaleDateString('fr-FR', { dateStyle: 'long' });
      case 'week': return `Semaine du ${now.toLocaleDateString('fr-FR')}`;
      case 'month': return now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      case 'quarter': return `T${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
      case 'year': return now.getFullYear().toString();
      default: return 'Période personnalisée';
    }
  }
}

export const reportService = ReportService.getInstance();