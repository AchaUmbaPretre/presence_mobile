import { api } from "@/api/client";
import { Coordinates, PointageLocation, ZoneVerification } from "../types/geoloc.types";

class LocationService {
  private static instance: LocationService;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Vérifie si l'utilisateur est dans une zone autorisée
   * @param userId - ID de l'utilisateur
   * @param latitude - Latitude de la position
   * @param longitude - Longitude de la position
   * @param precision - Précision GPS en mètres
   */
  async verifierZone(
    userId: number,
    latitude: number,
    longitude: number,
    precision: number
  ): Promise<ZoneVerification> {
    try {
      const response = await api.get("/api/geoloc/verifierZone", {
        params: {
          userId,
          latitude,
          longitude,
          precision
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("❌ Erreur vérification zone:", error);
      throw error;
    }
  }

  /**
   * Valide la localisation (ancienne méthode - à garder pour compatibilité)
   */
  async validateLocation(location: PointageLocation): Promise<boolean> {
    try {
      const response = await api.post("/api/location/validate", location);
      return response.data.valid;
    } catch (error) {
      console.error("Erreur validation location:", error);
      return false;
    }
  }

  /**
   * Récupère les coordonnées d'un site
   */
  async getSiteCoordinates(siteId: number): Promise<Coordinates> {
    try {
      const response = await api.get(`/api/sites/${siteId}/coordinates`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération site:", error);
      throw error;
    }
  }

  /**
   * Enregistre un pointage avec géolocalisation
   */
  async recordPointageWithLocation(
    userId: number,
    location: PointageLocation,
  ): Promise<any> {
    try {
      const response = await api.post("/api/presence/geoloc", {
        userId,
        ...location,
      });
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
    precision: number
  ): Promise<any> {
    try {
      // 1. D'abord vérifier la zone
      const verification = await this.verifierZone(userId, latitude, longitude, precision);
      
      if (!verification.data?.dans_zone) {
        throw new Error("Hors zone de pointage");
      }

      // 2. Ensuite enregistrer le pointage
      const pointage = await this.recordPointageWithLocation(userId, {
        latitude,
        longitude,
        accuracy: precision,
        timestamp: Date.now()
      });

      return {
        verification,
        pointage
      };
    } catch (error) {
      console.error("❌ Erreur vérification et pointage:", error);
      throw error;
    }
  }
}

export const locationService = LocationService.getInstance();