// services/weekService.ts
import { api } from "@/api/client";
import { WeekDay } from "../types/weekIndication.type";

export interface WeekResponse {
  success: boolean;
  data: {
    jours: WeekDay[];
    stats: {
      present: number;
      partial: number;
      total: number;
    };
    periode: {
      debut: string;
      fin: string;
    };
  };
  message?: string;
}

export const getSemainePresence = async (
  userId: number,
): Promise<WeekResponse> => {
  try {
    const response = await api.get<WeekResponse>(
      `/api/presence/semainePresenceById?userId=${userId}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("❌ Erreur récupération semaine:", error);
    throw error;
  }
};
