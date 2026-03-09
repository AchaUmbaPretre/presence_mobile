import { PointageRequest } from "../types/presence.types";
import { api } from "./../../../../requestMethods";

/**
 * Enregistre un pointage (arrivée ou départ)
 * @returns La réponse axios complète contenant PointageResponse dans .data
 */
export const postPresence = async (data: PointageRequest) => {
  return api.post("/api/presence", data);
};

/**
 * Récupère la liste des présences
 */
export const getPresences = async (params?: {
  date_debut?: string;
  date_fin?: string;
}) => {
  return api.get("/api/presence", { params });
};

interface HebdomadaireParams {
  id: number;
}

export const getHebdomadaireById = async (params: HebdomadaireParams) => {
  return api.get("/api/presence/hebdomadaireById", {
    params: {
      id: params.id,
    },
  });
};

/**
 * Récupère les statistiques de présence pour un utilisateur
 */
export const getPresenceStats = async (id_utilisateur: number) => {
  return api.get(`/api/presence/stats/${id_utilisateur}`);
};
