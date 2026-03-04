import { postPresence as apiPostPresence } from "./../../../api/presences";
import { PointageRequest, PointageResponse } from "../types/presence.types";

class PresenceService {
  private static instance: PresenceService;

  static getInstance(): PresenceService {
    if (!PresenceService.instance) {
      PresenceService.instance = new PresenceService();
    }
    return PresenceService.instance;
  }

  async enregistrerPointage(data: PointageRequest): Promise<PointageResponse> {
    try {
      const response = await apiPostPresence(data);
      return {
        success: true,
        message: response.data?.message || "Pointage enregistré avec succès",
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Erreur lors du pointage",
      };
    }
  }

  async getHistorique(id_utilisateur: number, date_debut?: string, date_fin?: string) {
    // Implémenter la récupération de l'historique
    // return await api.get(`/presences/${id_utilisateur}`, { params: { date_debut, date_fin } });
  }

  async getStatsSemaine(id_utilisateur: number) {
    // Implémenter les stats de la semaine
    // return await api.get(`/presences/${id_utilisateur}/stats/semaine`);
  }
}

export const presenceService = PresenceService.getInstance();