import {
    postPresence as apiPostPresence,
    PresencePayload,
} from "./../../..//api/presences";
import { SOURCE_MAPPING } from "../constants/dashboard.constants";
import { PointageRequest, PointageResponse } from "../types/presence.types";

class PresenceService {
  private static instance: PresenceService;

  static getInstance(): PresenceService {
    if (!PresenceService.instance) {
      PresenceService.instance = new PresenceService();
    }
    return PresenceService.instance;
  }

  // Adaptateur pour convertir PointageRequest en PresencePayload
  private adaptToPresencePayload(data: PointageRequest): PresencePayload {
    return {
      id_utilisateur: data.id_utilisateur,
      date_presence: data.date_presence,
      datetime: data.datetime,
      // Mapper la source vers un type accepté par l'API
      source: SOURCE_MAPPING[data.source] as "MANUEL",
      permissions: data.permissions,
      // Optionnel: ajouter device_sn si disponible
      // device_sn: data.device_sn,
    };
  }

  async enregistrerPointage(data: PointageRequest): Promise<PointageResponse> {
    try {
      // Adapter les données avant de les envoyer à l'API
      const payload = this.adaptToPresencePayload(data);
      const response = await apiPostPresence(payload);

      return {
        success: true,
        message: response.data?.message || "Pointage enregistré avec succès",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Erreur lors du pointage:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Erreur lors du pointage",
      };
    }
  }

  async getHistorique(
    id_utilisateur: number,
    date_debut?: string,
    date_fin?: string,
  ) {
    try {
      // Implémenter la récupération de l'historique
      // const response = await api.get(`/presences/${id_utilisateur}`, {
      //   params: { date_debut, date_fin }
      // });
      // return response.data;

      return []; // Retour temporaire
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      throw error;
    }
  }

  async getStatsSemaine(id_utilisateur: number) {
    try {
      // Implémenter les stats de la semaine
      // const response = await api.get(`/presences/${id_utilisateur}/stats/semaine`);
      // return response.data;

      return {
        total_heures: 0,
        retard_total: 0,
        heures_supplementaires: 0,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
      throw error;
    }
  }
}

export const presenceService = PresenceService.getInstance();
