
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationStatus {
  isWithinZone: boolean;
  distance: number;
  accuracy: number;
  timestamp: number;
}

export interface LocationError {
  code: string;
  message: string;
}

export interface LocationPermission {
  granted: boolean;
  canAskAgain: boolean;
}

export interface PointageLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface SiteZone {
  id: number;
  name: string;
  coordinates: Coordinates;
  radius: number;
  address?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PointageLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface ZoneInfo {
  id_zone: number;
  nom_zone: string;
  site_id?: number;
  nom_site?: string;
  distance: number;
  rayon: number;
  dans_zone: boolean;
  precision_requise: number;
  precision_actuelle: number;
  precision_ok: boolean;
  valide: boolean;
  type_zone: string;
  est_principal?: boolean;
}

export interface ZoneVerification {
  success: boolean;
  data: {
    dans_zone: boolean;
    zone: ZoneInfo | null;
    zone_plus_proche: ZoneInfo;
    zones_utilisateur: ZoneInfo[];
    sites_autorises: number[];
    timestamp: string;
  };
}