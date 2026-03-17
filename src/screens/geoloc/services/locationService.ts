import { api } from "@/api/client";
import { PointageLocation, ZoneVerification } from "../types/geoloc.types";

class LocationService {
  private static instance: LocationService;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async verifierZone(
    userId: number,
    latitude: number,
    longitude: number,
    precision: number,
  ): Promise<ZoneVerification> {
    try {
      // CORRECTION: Les paramètres sont dans params, pas dans body
      const response = await api.get(`/api/presence/verifierZone`, {
        params: {
          userId,
          latitude,
          longitude,
          precision,
        },
      });

      console.log("✅ Réponse vérification zone:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur vérification zone:", error);
      throw error;
    }
  }

  async recordPointageWithLocation(
    userId: number,
    location: PointageLocation,
  ): Promise<any> {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const payload = {
        id_utilisateur: userId,
        date_presence: `${year}-${month}-${day}`,
        datetime: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        source: "MANUEL",
        permissions: ["attendance.events.approve"],
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp,
        },
      };

      const response = await api.post("/api/presence", payload);
      return response.data;
    } catch (error) {
      console.error("Erreur pointage géoloc:", error);
      throw error;
    }
  }

  /**
   * Vérifie la zone et enregistre le pointage en une seule opération
   */
  async verifierEtPointer(
    userId: number,
    latitude: number,
    longitude: number,
    precision: number,
  ): Promise<any> {
    try {
      const verification = await this.verifierZone(
        userId,
        latitude,
        longitude,
        precision,
      );

      if (!verification.data?.dans_zone) {
        throw new Error("Hors zone de pointage");
      }

      // 2. Ensuite enregistrer le pointage
      const pointage = await this.recordPointageWithLocation(userId, {
        latitude,
        longitude,
        accuracy: precision,
        timestamp: Date.now(),
      });

      return {
        verification,
        pointage,
      };
    } catch (error) {
      console.error("❌ Erreur vérification et pointage:", error);
      throw error;
    }
  }
}

export const locationService = LocationService.getInstance();
