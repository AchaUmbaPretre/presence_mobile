import { COLORS } from "@/screens/dashboard/constants/color";
import { ReportStats } from "../types/report.types";

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

export const MOCK_REPORT_STATS: ReportStats = {
  summary: {
    total_presences: 142,
    total_absences: 8,
    total_retards: 12,
    total_heures_travaillees: 1120,
    total_heures_supp: 45.5,
    taux_presence: 94,
    moyenne_heures_jour: 7.5,
    jours_travailles: 22,
  },
  chartData: {
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    datasets: [
      {
        data: [12, 15, 14, 16, 18, 10],
        color: COLORS.primary.main,
        label: "Présences",
      },
    ],
  },
  tableData: [
    {
      id: 1,
      date: "2026-03-09",
      present: 15,
      absent: 2,
      retard: 1,
      conge: 0,
      mission: 0,
      maladie: 0,
    },
    {
      id: 2,
      date: "2026-03-08",
      present: 14,
      absent: 1,
      retard: 2,
      conge: 1,
      mission: 0,
      maladie: 0,
    },
    {
      id: 3,
      date: "2026-03-07",
      present: 16,
      absent: 0,
      retard: 0,
      conge: 0,
      mission: 2,
      maladie: 0,
    },
  ],
  period: "Mars 2026",
  generatedAt: new Date().toISOString(),
};

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
