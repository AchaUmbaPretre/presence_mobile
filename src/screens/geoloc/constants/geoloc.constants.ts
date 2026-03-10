import { COLORS } from "@/screens/dashboard/constants/color";
import { SiteZone } from "../types/geoloc.types";

export const DEFAULT_SITE: SiteZone = {
  id: 1,
  name: "Site Principal",
  coordinates: {
    latitude: -4.37589,
    longitude: 15.264516,
  },
  radius: 100,
  address: "08 Avenue, Kinshasa",
};

export const ZONE_COLORS = {
  authorized: COLORS.success.main,
  warning: COLORS.warning.main,
  forbidden: COLORS.error.main,
  neutral: COLORS.gray[400],
} as const;

export const LOCATION_ACCURACY = {
  high: 10, // 10 mètres
  medium: 50, // 50 mètres
  low: 100, // 100 mètres
} as const;

export const LOCATION_MESSAGES = {
  permissionDenied: "Permission de localisation refusée",
  withinZone: "Vous êtes dans la zone autorisée",
  outsideZone: "Vous êtes en dehors de la zone autorisée",
  poorAccuracy: "Précision insuffisante, veuillez activer le GPS",
  loading: "Recherche de votre position...",
  error: "Erreur de localisation",
} as const;
