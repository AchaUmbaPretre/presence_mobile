import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/color";

export interface ActivityItem {
  id: string;
  type: "arrival" | "departure" | "break";
  time: string;
  status: string;
  date: string;
}

export interface ActivityListProps {
  activities: ActivityItem[];
  onSeeAll?: () => void;
  onActivityPress?: (activity: ActivityItem) => void;
  maxItems?: number;
}

export type ActivityConfig = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: {
    primary: string;
    light: string;
    gradient: readonly [string, string];
  };
  badge: string;
};

export const ACTIVITY_CONFIG: Record<string, ActivityConfig> = {
  arrival: {
    label: "Arrivée",
    icon: "log-in-outline",
    colors: {
      primary: COLORS.success.main,
      light: COLORS.success.light,
      gradient: [COLORS.success.light, COLORS.success.main] as const,
    },
    badge: "Présent",
  },
  departure: {
    label: "Départ",
    icon: "log-out-outline",
    colors: {
      primary: COLORS.error.main,
      light: COLORS.error.light,
      gradient: [COLORS.error.light, COLORS.error.main] as const,
    },
    badge: "Sorti",
  },
  break: {
    label: "Pause",
    icon: "cafe-outline",
    colors: {
      primary: COLORS.warning.main,
      light: COLORS.warning.light,
      gradient: [COLORS.warning.light, COLORS.warning.main] as const,
    },
    badge: "Pause",
  },
  absent: {
    label: "Absent",
    icon: "close-circle-outline",
    colors: {
      primary: COLORS.error.main,
      light: COLORS.error.light,
      gradient: [COLORS.error.light, COLORS.error.main] as const,
    },
    badge: "Absent",
  },
  non_travaille: {
    label: "Non travaillé",
    icon: "calendar-outline",
    colors: {
      primary: COLORS.gray[500],
      light: COLORS.gray[100],
      gradient: [COLORS.gray[100], COLORS.gray[200]] as const,
    },
    badge: "Non travaillé",
  },
  ferie: {
    label: "Férié",
    icon: "gift-outline",
    colors: {
      primary: COLORS.warning.main,
      light: COLORS.warning.light,
      gradient: [COLORS.warning.light, COLORS.warning.main] as const,
    },
    badge: "Férié",
  },
  justifie: {
    label: "Justifié",
    icon: "document-text-outline",
    colors: {
      primary: COLORS.primary.main,
      light: COLORS.primary.light,
      gradient: [COLORS.primary.light, COLORS.primary.main] as const,
    },
    badge: "Justifié",
  },
  supplementaire: {
    label: "Supplémentaire",
    icon: "trending-up-outline",
    colors: {
      primary: COLORS.success.dark,
      light: COLORS.success.light,
      gradient: [COLORS.success.light, COLORS.success.main] as const,
    },
    badge: "Suppl.",
  },
};