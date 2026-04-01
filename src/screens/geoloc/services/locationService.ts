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
      const date_presence = now.toISOString().split("T")[0];
      const timezoneOffset = -now.getTimezoneOffset() / 60;

      const payload = {
        id_utilisateur: userId,
        date_presence,
        source: "GEOLOC",
        permissions: ["attendance.events.approve"],
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: location.timestamp,
        },
        timezone_offset: timezoneOffset,
      };

      
      const response = await api.post("/api/presence", payload);
      
      return response.data;
    } catch (error: any) {
      console.error("❌ Erreur pointage géoloc:", error);
      
      if (error.response) {
        throw new Error(error.response.data?.message || "Erreur lors du pointage");
      }
      throw error;
    }
  }

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
        throw new Error(
          `Hors zone de pointage. ${verification.data?.zone_plus_proche?.nom_zone ? `Zone la plus proche: ${verification.data.zone_plus_proche.nom_zone} à ${verification.data.zone_plus_proche.distance}m` : ""}`,
        );
      }

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