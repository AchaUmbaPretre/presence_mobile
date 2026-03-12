import { api } from "@/api/client";
import { ActivityItem } from "../types/activity.types";

export interface ActivityResponse {
  success: boolean;
  data: ActivityItem[];
  total: number;
}

interface ApiResponse {
  success?: boolean;
  data?: ActivityItem[];
  total?: number;
}

export const getActivityListe = async (
  id_utilisateur: number,
): Promise<ActivityResponse> => {
  try {
    const response = await api.get<ApiResponse>(
      `/api/presence/activitesRecentes?userId=${id_utilisateur}`,
    );

    const responseData = response.data;

    if (responseData?.data && Array.isArray(responseData.data)) {
      return {
        success: responseData.success ?? true,
        data: responseData.data,
        total: responseData.total ?? responseData.data.length,
      };
    }

    // Si l'API retourne directement un tableau dans response.data
    if (Array.isArray(responseData)) {
      return {
        success: true,
        data: responseData,
        total: responseData.length,
      };
    }

    // Si l'API retourne un objet avec une propriété 'activities'
    if (
      responseData &&
      "activities" in responseData &&
      Array.isArray((responseData as any).activities)
    ) {
      return {
        success: true,
        data: (responseData as any).activities,
        total: (responseData as any).activities.length,
      };
    }

    // Fallback: retourner un tableau vide
    return {
      success: false,
      data: [],
      total: 0,
    };
  } catch (error) {
    console.error("❌ Erreur récupération activités:", error);
    throw error;
  }
};
