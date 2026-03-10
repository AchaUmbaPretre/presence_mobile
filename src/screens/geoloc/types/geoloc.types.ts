 export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationStatus {
  isWithinZone: boolean;
  distance: number; // en mètres
  accuracy: number;
  timestamp: number;
}

export interface SiteZone {
  id: number;
  name: string;
  coordinates: Coordinates;
  radius: number; // en mètres
  address?: string;
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
}

export interface LocationError {
  code: string;
  message: string;
}

export interface PointageLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}