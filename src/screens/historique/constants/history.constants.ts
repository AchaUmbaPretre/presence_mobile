import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import {
    HistoryItems,
    HistoryStats,
    PresenceStatus,
} from "../types/history.types";

type IconName = keyof typeof Ionicons.glyphMap;

export const STATUS_CONFIG: Record<
  PresenceStatus,
  {
    label: string;
    color: string;
    lightColor: string;
    icon: IconName;
    badge: string;
  }
> = {
  PRESENT: {
    label: "Présent",
    color: COLORS.success.main,
    lightColor: COLORS.success.light,
    icon: "checkmark-circle",
    badge: "Présent",
  },
  ABSENT: {
    label: "Absent",
    color: COLORS.error.main,
    lightColor: COLORS.error.light,
    icon: "close-circle",
    badge: "Absent",
  },
  RETARD: {
    label: "Retard",
    color: COLORS.warning.main,
    lightColor: COLORS.warning.light,
    icon: "time",
    badge: "Retard",
  },
  CONGE: {
    label: "Congé",
    color: COLORS.primary?.main || COLORS.primary.main,
    lightColor: COLORS.primary?.light || COLORS.primary.light,
    icon: "umbrella",
    badge: "Congé",
  },
  MISSION: {
    label: "Mission",
    color: COLORS.secondary?.main || COLORS.primary.main,
    lightColor: COLORS.secondary?.light || COLORS.primary.light,
    icon: "briefcase",
    badge: "Mission",
  },
  MALADIE: {
    label: "Maladie",
    color: COLORS.warning.dark || COLORS.warning.main,
    lightColor: COLORS.warning.light,
    icon: "medical",
    badge: "Maladie",
  },
  // ✅ AJOUT DES STATUTS MANQUANTS
  JOUR_NON_TRAVAILLE: {
    label: "Non travaillé",
    color: COLORS.gray[500],
    lightColor: COLORS.gray[200],
    icon: "calendar-outline",
    badge: "Non travaillé",
  },
  JOUR_FERIE: {
    label: "Férié",
    color: COLORS.warning.main,
    lightColor: COLORS.warning.light,
    icon: "gift-outline",
    badge: "Férié",
  },
  ABSENCE_JUSTIFIEE: {
    label: "Absence justifiée",
    color: COLORS.primary?.main || COLORS.primary.main,
    lightColor: COLORS.primary?.light || COLORS.primary.light,
    icon: "document-text-outline",
    badge: "Justifié",
  },
  SUPPLEMENTAIRE: {
    label: "Supplémentaire",
    color: COLORS.success.dark || COLORS.success.main,
    lightColor: COLORS.success.light,
    icon: "trending-up-outline",
    badge: "Suppl.",
  },
};

export const SORT_OPTIONS = [
  { label: "Date (récent)", value: "date_desc" },
  { label: "Date (ancien)", value: "date_asc" },
  { label: "Retard (déc.)", value: "retard_desc" },
  { label: "Retard (crois.)", value: "retard_asc" },
  { label: "Heures sup (déc.)", value: "heures_desc" },
  { label: "Heures sup (crois.)", value: "heures_asc" },
];

export const STATUS_OPTIONS = [
  { label: "Présent", value: "PRESENT", color: COLORS.success.main },
  { label: "Absent", value: "ABSENT", color: COLORS.error.main },
  { label: "Retard", value: "RETARD", color: COLORS.warning.main },
  {
    label: "Congé",
    value: "CONGE",
    color: COLORS.primary?.main || COLORS.primary.main,
  },
  {
    label: "Mission",
    value: "MISSION",
    color: COLORS.secondary?.main || COLORS.primary.main,
  },
  { label: "Maladie", value: "MALADIE", color: COLORS.warning.dark },
  {
    label: "Non travaillé",
    value: "JOUR_NON_TRAVAILLE",
    color: COLORS.gray[500],
  },
  { label: "Férié", value: "JOUR_FERIE", color: COLORS.warning.main },
  {
    label: "Absence justifiée",
    value: "ABSENCE_JUSTIFIEE",
    color: COLORS.primary?.main || COLORS.primary.main,
  },
  {
    label: "Supplémentaire",
    value: "SUPPLEMENTAIRE",
    color: COLORS.success.dark || COLORS.success.main,
  },
];

export const MOCK_HISTORY: HistoryItems[] = [
  {
    id: 1,
    date: "2026-03-10",
    heure_entree: "08:15",
    heure_sortie: "17:30",
    retard_minutes: 0,
    heures_supplementaires: 0.5,
    statut: "PRESENT",
    site: "Site Principal",
    source: "MANUEL",
    is_locked: false,
  },
  {
    id: 2,
    date: "2026-03-09",
    heure_entree: "08:45",
    heure_sortie: "18:00",
    retard_minutes: 15,
    heures_supplementaires: 1,
    statut: "RETARD",
    site: "Site Principal",
    source: "QR_CODE",
    is_locked: false,
  },
  {
    id: 3,
    date: "2026-03-08",
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
    statut: "ABSENT",
    site: "",
    source: "MANUEL",
    is_locked: false,
  },
  {
    id: 4,
    date: "2026-03-07",
    heure_entree: "08:00",
    heure_sortie: "16:00",
    retard_minutes: 0,
    heures_supplementaires: 0,
    statut: "PRESENT",
    site: "Site Principal",
    source: "GEOLOC",
    is_locked: false,
  },
  {
    id: 5,
    date: "2026-03-06",
    heure_entree: "09:00",
    heure_sortie: "17:00",
    retard_minutes: 30,
    heures_supplementaires: 0,
    statut: "RETARD",
    site: "Site Secondaire",
    source: "TERMINAL",
    is_locked: false,
  },
];

export const MOCK_STATS: HistoryStats = {
  total_jours: 30,
  total_presents: 22,
  total_absents: 3,
  total_retards: 5,
  total_non_travailles: 2, // ← AJOUTÉ
  total_feries: 1, // ← AJOUTÉ
  total_justifies: 1, // ← AJOUTÉ
  total_heures_supp: 176,
  moyenne_heures: 7.33,
  total_retard_minutes: 45,
  objectif_hebdo: 35,
  objectif_atteint: 176,
  sites_visites: 2,
  derniere_presence: "2026-03-10",
  repartition: {
    present: 22,
    absent: 3,
    justifie: 1,
    ferie: 1,
    non_travaille: 2,
    supplementaire: 1,
  },
};

export const HISTORY_MESSAGES = {
  empty: "Aucun historique trouvé",
  loading: "Chargement de l'historique...",
  error: "Erreur lors du chargement",
  export: "Export en cours...",
  exportSuccess: "Historique exporté avec succès",
  exportError: "Erreur lors de l'export",
  filterTitle: "Filtrer l'historique",
  reset: "Réinitialiser",
  apply: "Appliquer",
  cancel: "Annuler",
};
