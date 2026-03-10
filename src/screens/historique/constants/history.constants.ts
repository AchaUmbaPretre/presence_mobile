import { COLORS } from "@/screens/dashboard/constants/color";
import { HistoryItems, HistoryStats, PresenceStatus } from "../types/history.types";
import { Ionicons } from "@expo/vector-icons";

// ✅ Définir un type explicite pour l'icône
type IconName = keyof typeof Ionicons.glyphMap;

export const STATUS_CONFIG: Record<PresenceStatus, {
  label: string;
  color: string;
  lightColor: string;
  icon: IconName;  // ← Type explicite pour l'icône
  badge: string;
}> = {
  PRESENT: {
    label: 'Présent',
    color: COLORS.success.main,
    lightColor: COLORS.success.light,
    icon: 'checkmark-circle',  // ← Maintenant typé correctement
    badge: 'Présent',
  },
  ABSENT: {
    label: 'Absent',
    color: COLORS.error.main,
    lightColor: COLORS.error.light,
    icon: 'close-circle',
    badge: 'Absent',
  },
  RETARD: {
    label: 'Retard',
    color: COLORS.warning.main,
    lightColor: COLORS.warning.light,
    icon: 'time',
    badge: 'Retard',
  },
  CONGE: {
    label: 'Congé',
    color: COLORS.primary?.main || COLORS.primary.main,
    lightColor: COLORS.primary?.light || COLORS.primary.light,
    icon: 'umbrella',
    badge: 'Congé',
  },
  MISSION: {
    label: 'Mission',
    color: COLORS.secondary?.main || COLORS.primary.main,
    lightColor: COLORS.secondary?.light || COLORS.primary.light,
    icon: 'briefcase',
    badge: 'Mission',
  },
  MALADIE: {
    label: 'Maladie',
    color: COLORS.warning.dark || COLORS.warning.main,
    lightColor: COLORS.warning.light,
    icon: 'medical',
    badge: 'Maladie',
  },
};

export const SORT_OPTIONS = [
  { label: 'Date (récent)', value: 'date_desc' },
  { label: 'Date (ancien)', value: 'date_asc' },
  { label: 'Retard (déc.)', value: 'retard_desc' },
  { label: 'Retard (crois.)', value: 'retard_asc' },
  { label: 'Heures sup (déc.)', value: 'heures_desc' },
  { label: 'Heures sup (crois.)', value: 'heures_asc' },
];

export const STATUS_OPTIONS = [
  { label: 'Présent', value: 'PRESENT', color: COLORS.success.main },
  { label: 'Absent', value: 'ABSENT', color: COLORS.error.main },
  { label: 'Retard', value: 'RETARD', color: COLORS.warning.main },
  { label: 'Congé', value: 'CONGE', color: COLORS.primary.main },
  { label: 'Mission', value: 'MISSION', color: COLORS.secondary.main },
  { label: 'Maladie', value: 'MALADIE', color: COLORS.warning.dark },
];

export const MOCK_HISTORY: HistoryItems[] = [
  {
    id: 1,
    date: '2026-03-10',
    heure_entree: '08:15',
    heure_sortie: '17:30',
    retard_minutes: 0,
    heures_supplementaires: 0.5,
    statut: 'PRESENT',
    site: 'Site Principal',
    source: 'MANUEL',
  },
  {
    id: 2,
    date: '2026-03-09',
    heure_entree: '08:45',
    heure_sortie: '18:00',
    retard_minutes: 15,
    heures_supplementaires: 1,
    statut: 'RETARD',
    site: 'Site Principal',
    source: 'QR_CODE',
  },
  {
    id: 3,
    date: '2026-03-08',
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
    statut: 'ABSENT',
    site: '',
    source: 'MANUEL',
  },
  {
    id: 4,
    date: '2026-03-07',
    heure_entree: '08:00',
    heure_sortie: '16:00',
    retard_minutes: 0,
    heures_supplementaires: 0,
    statut: 'PRESENT',
    site: 'Site Principal',
    source: 'GEOLOC',
  },
  {
    id: 5,
    date: '2026-03-06',
    heure_entree: '09:00',
    heure_sortie: '17:00',
    retard_minutes: 30,
    heures_supplementaires: 0,
    statut: 'RETARD',
    site: 'Site Secondaire',
    source: 'TERMINAL',
  },
];

export const MOCK_STATS: HistoryStats = {
  total_jours: 30,
  total_presents: 22,
  total_absents: 3,
  total_retards: 5,
  total_heures: 176,
  moyenne_heures: 7.33,
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