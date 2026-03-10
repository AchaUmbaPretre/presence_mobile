import { api } from "@/api/client";
import { Coordinates, PointageLocation } from "../types/geoloc.types";

class LocationService {
  private static instance: LocationService;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async validateLocation(location: PointageLocation): Promise<boolean> {
    try {
      const response = await api.post("/api/location/validate", location);
      return response.data.valid;
    } catch (error) {
      console.error("Erreur validation location:", error);
      return false;
    }
  }

  async getSiteCoordinates(siteId: number): Promise<Coordinates> {
    try {
      const response = await api.get(`/api/sites/${siteId}/coordinates`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération site:", error);
      throw error;
    }
  }

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
}

export const locationService = LocationService.getInstance();
