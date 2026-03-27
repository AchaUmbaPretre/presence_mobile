import { PointageRequest, ValideData } from "../types/presence.types";
import userRequest, { api } from "./../../../../requestMethods";
import axios from 'axios';

interface HebdomadaireParams {
  id: number;
}

export const getPresenceByUserId = async (userId: number) => {
  return api.get(`/api/presence/user/${userId}/today`);
};

export const postPresence = async (data: PointageRequest) => {
  return api.post("/api/presence", data);
};

export const getPresences = async (params?: {
  date_debut?: string;
  date_fin?: string;
}) => {
  return api.get("/api/presence", { params });
};

export const getHebdomadaireById = async (params: HebdomadaireParams) => {
  return api.get("/api/presence/hebdomadaireById", {
    params: {
      id: params.id,
    },
  });
};

export const getValidateQR = async (data: ValideData) => {
  try {
    const response = await userRequest.post(`/api/presence/qr/validate`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorData = error.response.data;
        throw {
          code: errorData.code || 'API_ERROR',
          message: errorData.message || 'Erreur lors du pointage',
          status: error.response.status,
          data: errorData
        };
      } else if (error.request) {
        throw {
          code: 'NETWORK_ERROR',
          message: 'Impossible de contacter le serveur',
          status: 0
        };
      }
    }
    
    throw {
      code: 'REQUEST_ERROR',
      message: error instanceof Error ? error.message : 'Erreur de requête',
      status: 0
    };
  }
};
