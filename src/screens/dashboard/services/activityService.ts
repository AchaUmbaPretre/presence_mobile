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

    if (Array.isArray(responseData)) {
      return {
        success: true,
        data: responseData,
        total: responseData.length,
      };
    }

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
