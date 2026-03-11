import { api } from "@/api/client";
import {
    ReportChartData,
    ReportFilters,
    ReportFormat,
    ReportPeriod,
    ReportSummary,
    ReportTableData,
} from "../types/report.types";

class ReportService {
  private static instance: ReportService;

  static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async getReportStats(filters: ReportFilters) {
    try {
      // Construction des paramètres de requête
      const params: any = {
        userId: filters.userId,
        period: filters.period,
      };

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }
      if (filters.year) {
        params.year = filters.year;
      }
      if (filters.month) {
        params.month = filters.month;
      }

      // Appel API réel
      const response = await api.get("/api/presence/rapportPresenceById", {
        params,
      });

      const apiResponse = response.data;

      if (!apiResponse.success) {
        throw new Error(
          apiResponse.message || "Erreur lors du chargement du rapport",
        );
      }

      // ✅ Adaptation de la réponse API au format attendu par les composants
      const data = apiResponse.data;

      // Structure pour ReportSummaryCards
      const summary: ReportSummary = {
        total_presents: data.summary.total_presents,
        total_absents: data.summary.total_absents,
        total_retards: data.summary.total_retards,
        total_heures_supp: data.summary.total_heures_supp,
        total_retard_minutes: data.summary.total_retard_minutes,
        moyenne_heures: data.summary.moyenne_heures,
        taux_presence: data.summary.taux_presence,
        total_non_travailles: data.summary.total_non_travailles,
        total_feries: data.summary.total_feries,
        total_justifies: data.summary.total_justifies,
        total_jours: data.summary.total_jours,
      };

      // Structure pour ReportChart
      const chartData: ReportChartData = {
        labels: data.chartData.labels,
        datasets: data.chartData.datasets.map((dataset: any) => ({
          data: dataset.data,
          color: dataset.color,
          label: dataset.label,
        })),
      };

      // Structure pour ReportStatsTable
      const tableData: ReportTableData[] = data.tableData.map((row: any) => ({
        id: row.id,
        date: row.date,
        present: row.present,
        absent: row.absent,
        retard: row.retard,
        conge: row.conge,
        mission: row.mission,
        maladie: row.maladie,
      }));

      return {
        summary,
        chartData,
        tableData,
        period: data.periode.libelle,
        generatedAt: data.generatedAt,
      };
    } catch (error) {
      console.error("❌ Erreur chargement rapport:", error);

      // Fallback aux données mockées en cas d'erreur
      console.log("⚠️ Utilisation des données mockées");
    }
  }

  /**
   * Exporte le rapport au format spécifié
   */
  async exportReport(
    filters: ReportFilters,
    format: ReportFormat,
  ): Promise<string> {
    try {
      const params: any = {
        userId: filters.userId,
        period: filters.period,
        format,
      };

      if (filters.startDate) {
        params.startDate = filters.startDate;
      }
      if (filters.endDate) {
        params.endDate = filters.endDate;
      }

      const response = await api.get("/presence/exportRapport", {
        params,
        responseType: "blob",
      });

      // Pour React Native, on retourne l'URL du blob
      const blob = response.data;
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("❌ Erreur export rapport:", error);
      throw error;
    }
  }

  /**
   * Récupère les périodes disponibles pour les rapports
   */
  async getAvailablePeriods(userId: number): Promise<string[]> {
    try {
      const response = await api.get("/presence/periodes-disponibles", {
        params: { userId },
      });

      return response.data.data || [];
    } catch (error) {
      console.error("❌ Erreur chargement périodes:", error);
      return [];
    }
  }

  /**
   * Obtient le libellé d'une période
   */
  private getPeriodLabel(period: ReportPeriod): string {
    const now = new Date();
    switch (period) {
      case "day":
        return now.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      case "week":
        return `Semaine du ${now.toLocaleDateString("fr-FR")}`;
      case "month":
        return now.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });
      case "quarter":
        return `T${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
      case "year":
        return now.getFullYear().toString();
      default:
        return "Période personnalisée";
    }
  }
}

export const reportService = ReportService.getInstance();
