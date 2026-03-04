import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const ID_UTILISATEUR = 1;

export const HORAIRES_TYPE = {
  ENTREE: "ENTREE",
  SORTIE: "SORTIE",
} as const;

export const ACTIONS_RAPIDES = [
  {
    icon: "qrcode-scan",
    label: "QR Code",
    color: "#3B82F6",
  },
  {
    icon: "map-marker-outline",
    label: "Géoloc",
    color: "#3B82F6",
  },
  {
    icon: "history",
    label: "Historique",
    color: "#3B82F6",
  },
  {
    icon: "file-document-outline",
    label: "Rapports",
    color: "#3B82F6",
  },
] as const;

export const WEEK_DAYS = [
  { letter: "L", full: "Lundi" },
  { letter: "M", full: "Mardi" },
  { letter: "M", full: "Mercredi" },
  { letter: "J", full: "Jeudi" },
  { letter: "V", full: "Vendredi" },
  { letter: "S", full: "Samedi" },
] as const;

export const ACTIVITES_RECENTES = [
  { type: "arrival", time: "08:45", status: "À l'heure", id: "1" },
  { type: "break", time: "12:30 - 13:30", status: "1h", id: "2" },
] as const;

export const LAYOUT = {
  screenWidth: width,
  cardWidth: (width - 44) / 2,
  actionItemWidth: (width - 50) / 2,
} as const;
