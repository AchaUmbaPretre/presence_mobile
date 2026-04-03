import { Platform } from "react-native";
import Constants from "expo-constants";
import { StorageInfo } from "../types/settings.types";
import { COLORS } from "../../dashboard/constants/color";

const manifest = Constants.manifest || Constants.manifest2?.extra?.expoClient || {};
export const APP_VERSION = (manifest as any).version || "1.0.0";
export const BUILD_NUMBER = Platform.select({
  ios: (manifest as any).ios?.buildNumber || "1",
  android: (manifest as any).android?.versionCode?.toString() || "1",
  default: "1",
});

export const STORAGE_INFO: StorageInfo = {
  used: 2.4,
  total: 16,
  percentage: 15,
};

export const supportsBiometrics = Platform.select({
  ios: true,
  android: true,
  default: false,
});

export const LANGUAGE_OPTIONS = [
  { label: "Français", value: "Français" },
  { label: "English", value: "English" },
  { label: "Español", value: "Español" },
];

export const ALERT_MESSAGES = {
  LANGUAGE: {
    title: "Choisir la langue",
    cancel: "Annuler",
  },
  CACHE: {
    title: "Vider le cache",
    message: "Cette action supprimera les données temporaires. Êtes-vous sûr ?",
    confirm: "Vider",
    cancel: "Annuler",
    success: "Cache vidé avec succès",
  },
  EXPORT: {
    title: "Exporter mes données",
    message: "Vos données seront exportées au format JSON. Voulez-vous continuer ?",
    confirm: "Exporter",
    cancel: "Annuler",
    success: "Export démarré",
  },
  DELETE_ACCOUNT: {
    title: "Supprimer le compte",
    message: "Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
    confirm: "Supprimer",
    cancel: "Annuler",
  },
  UPDATE: {
    title: "Mise à jour disponible",
    message: "Une nouvelle version est disponible. Voulez-vous la télécharger ?",
    confirm: "Mettre à jour",
    cancel: "Plus tard",
    upToDate: "À jour",
    upToDateMessage: "Vous utilisez la dernière version",
    error: "Impossible de vérifier les mises à jour",
  },
  RESET: {
    title: "Réinitialiser les paramètres",
    message: "Tous vos paramètres seront réinitialisés. Êtes-vous sûr ?",
    confirm: "Réinitialiser",
    cancel: "Annuler",
    success: "Paramètres réinitialisés",
  },
  LOGOUT: {
    title: "Déconnexion",
    message: "Êtes-vous sûr de vouloir vous déconnecter ?",
    confirm: "Se déconnecter",
    cancel: "Annuler",
  },
} as const;

export const URLS = {
  PRIVACY: "https://example.com/privacy",
  TERMS: "https://example.com/terms",
  APP_STORE: {
    ios: "https://apps.apple.com/app/id123456789",
    android: "https://play.google.com/store/apps/details?id=com.yourapp",
  },
  SHARE: "https://example.com/app",
  EMAIL: "support@example.com?subject=Support",
} as const;

export const COMPANY = {
  name: "Your Company",
  year: "2024",
} as const;