// types/geoloc.types.ts
import type { LocationObject } from "expo-location";
import { Region } from "react-native-maps";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationStatus {
  isWithinZone: boolean;
  distance: number;
  accuracy: number;
  timestamp: number;
  currentZone?: ZoneInfo | null; // Ajout
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

export interface ZoneVerificationData {
  dans_zone: boolean;
  zone: ZoneInfo | null;
  zone_plus_proche: ZoneInfo;
  zones_utilisateur: ZoneInfo[];
  sites_autorises: number[];
  timestamp: string;
}

export interface ZoneVerification {
  success: boolean;
  data: ZoneVerificationData;
  message?: string;
}

export interface UseLocationProps {
  siteCoordinates: Coordinates;
  siteRadius: number;
  onStatusChange?: (status: LocationStatus) => void;
}

export interface UseLocationReturn {
  location: LocationObject | null;
  status: LocationStatus;
  zoneVerification: ZoneVerification | null;
  error: LocationError | null;
  isLoading: boolean;
  permission: LocationPermission;
  getCurrentLocation: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  checkNetworkAndGPS: () => Promise<boolean>;
}

export interface ZoneIndicatorProps {
  status: LocationStatus;
  maxDistance?: number;
}

export interface LocationPermissionProps {
  onRequestPermission: () => void;
  onClose?: () => void;
}

export interface LocationMapProps {
  siteCoordinates: Coordinates;
  userLocation?: Coordinates;
  radius: number;
  isWithinZone?: boolean;
  onMapReady?: () => void;
  onRegionChange?: (region: Region) => void;
}

export interface LocationInfoProps {
  status: LocationStatus;
  isLoading: boolean;
}