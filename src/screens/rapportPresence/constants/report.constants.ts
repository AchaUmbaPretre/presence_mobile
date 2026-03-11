import { COLORS } from "@/screens/dashboard/constants/color";

export const REPORT_PERIODS = [
  { label: "Aujourd'hui", value: "day" },
  { label: "Cette semaine", value: "week" },
  { label: "Ce mois", value: "month" },
  { label: "Ce trimestre", value: "quarter" },
  { label: "Cette année", value: "year" },
  { label: "Personnalisé", value: "custom" },
] as const;

export const REPORT_SUMMARY_CONFIG = [
  {
    id: "presences",
    icon: "checkmark-circle" as const,
    label: "Présences",
    color: COLORS.success.main,
    lightColor: COLORS.success.light,
  },
  {
    id: "absences",
    icon: "close-circle" as const,
    label: "Absences",
    color: COLORS.error.main,
    lightColor: COLORS.error.light,
  },
  {
    id: "retards",
    icon: "time" as const,
    label: "Retards",
    color: COLORS.warning.main,
    lightColor: COLORS.warning.light,
  },
  {
    id: "heures_sup",
    icon: "trending-up" as const,
    label: "Heures sup",
    color: COLORS.primary.main,
    lightColor: COLORS.primary.light,
  },
] as const;

export const REPORT_MESSAGES = {
  empty: "Aucune donnée disponible pour cette période",
  loading: "Génération du rapport...",
  error: "Erreur lors de la génération du rapport",
  exportSuccess: "Rapport exporté avec succès",
  exportError: "Erreur lors de l'export",
  share: "Partager le rapport",
  download: "Télécharger",
  period: "Période",
  generate: "Générer",
};
