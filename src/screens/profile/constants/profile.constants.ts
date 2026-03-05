import { COLORS } from "../../dashboard/constants/color";
import { StatItem } from "../types/profile.types";

export const STATS: StatItem[] = [
  {
    label: "Présences",
    value: "14",
    icon: "calendar",
    color: COLORS.primary.main,
  },
  {
    label: "Retards",
    value: "3",
    icon: "time",
    color: COLORS.warning.main,
  },
  {
    label: "Congés",
    value: "12",
    icon: "umbrella",
    color: COLORS.success.main,
  },
];

export const MOCK_USER = {
  name: "Acha umba",
  email: "achandambi@email.com",
  role: "Développeur",
  avatar:
    "https://thumbs.dreamstime.com/b/generic-male-user-profile-icon-formal-suit-clean-line-art-business-digital-avatars-simple-avatar-wearing-perfect-394004406.jpg",
  department: "Technique",
  joinDate: "Janvier 2026",
};

export const ALERT_MESSAGES = {
  LOGOUT: {
    title: "Déconnexion",
    message: "Êtes-vous sûr de vouloir vous déconnecter ?",
    cancel: "Annuler",
    confirm: "Se déconnecter",
  },
} as const;