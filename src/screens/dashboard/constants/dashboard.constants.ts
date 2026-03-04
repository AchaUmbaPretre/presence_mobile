import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// ==================== TYPES ====================
export type HorairesType = (typeof HORAIRES_TYPE)[keyof typeof HORAIRES_TYPE];
export type SourceType = keyof typeof SOURCE_MAPPING;
export type WeekDayLetter = (typeof WEEK_DAYS)[number]["letter"];
export type WeekDayFull = (typeof WEEK_DAYS)[number]["full"];
export type ActivityType = (typeof ACTIVITES_RECENTES)[number]["type"];
export type ActionId = (typeof ACTIONS_RAPIDES)[number]["id"];

// ==================== CONSTANTES UTILISATEUR ====================
export const ID_UTILISATEUR = 1;

// ==================== TYPES D'HORAIRES ====================
export const HORAIRES_TYPE = {
  ENTREE: "ENTREE",
  SORTIE: "SORTIE",
} as const;

// ==================== MAPPING DES SOURCES API ====================
export const SOURCE_MAPPING = {
  MANUEL: "MANUEL",
  QR_CODE: "MANUEL",
  GEOLOC: "MANUEL",
  TERMINAL: "TERMINAL",
  API: "API",
} as const;

// ==================== PALETTE DE COULEURS PAR ACTION ====================
export const ACTION_COLORS = {
  QR_CODE: "#3B82F6", // Bleu vif
  GEOLOC: "#10B981", // Vert émeraude
  HISTORIQUE: "#F59E0B", // Orange ambré
  RAPPORTS: "#8B5CF6", // Violet
} as const;

// ==================== COULEURS PAR TYPE ====================
export const STATUS_COLORS = {
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  primary: "#3B82F6",
  secondary: "#8B5CF6",
} as const;

// ==================== ACTIONS RAPIDES ====================
export const ACTIONS_RAPIDES = [
  {
    id: "qr_code",
    icon: "qr-code-outline" as const,
    label: "QR Code",
    color: ACTION_COLORS.QR_CODE,
    description: "Scanner un code",
    route: "/qr-scanner",
    gradient: [ACTION_COLORS.QR_CODE, "#2563EB"] as const,
  },
  {
    id: "geoloc",
    icon: "map-outline" as const,
    label: "Géoloc",
    color: ACTION_COLORS.GEOLOC,
    description: "Localisation",
    route: "/geolocation",
    gradient: [ACTION_COLORS.GEOLOC, "#059669"] as const,
  },
  {
    id: "historique",
    icon: "time-outline" as const,
    label: "Historique",
    color: ACTION_COLORS.HISTORIQUE,
    description: "Consultation",
    route: "/history",
    gradient: [ACTION_COLORS.HISTORIQUE, "#D97706"] as const,
  },
  {
    id: "rapports",
    icon: "document-text-outline" as const,
    label: "Rapports",
    color: ACTION_COLORS.RAPPORTS,
    description: "Visualisation",
    route: "/reports",
    gradient: [ACTION_COLORS.RAPPORTS, "#6D28D9"] as const,
  },
] as const;

// ==================== JOURS DE LA SEMAINE ====================
export const WEEK_DAYS = [
  { letter: "L", full: "Lundi", short: "Lun", number: 1 },
  { letter: "M", full: "Mardi", short: "Mar", number: 2 },
  { letter: "M", full: "Mercredi", short: "Mer", number: 3 },
  { letter: "J", full: "Jeudi", short: "Jeu", number: 4 },
  { letter: "V", full: "Vendredi", short: "Ven", number: 5 },
  { letter: "S", full: "Samedi", short: "Sam", number: 6 },
  { letter: "D", full: "Dimanche", short: "Dim", number: 0 },
] as const;

// ==================== ACTIVITÉS RÉCENTES (MOCK) ====================
export const ACTIVITES_RECENTES = [
  {
    id: "1",
    type: "arrival" as const,
    time: "08:45",
    status: "À l'heure",
    date: "2024-03-04",
    icon: "log-in-outline" as const,
    color: STATUS_COLORS.success,
  },
  {
    id: "2",
    type: "break" as const,
    time: "12:30 - 13:30",
    status: "1h",
    date: "2024-03-04",
    icon: "cafe-outline" as const,
    color: STATUS_COLORS.warning,
  },
  {
    id: "3",
    type: "departure" as const,
    time: "17:30",
    status: "Départ",
    date: "2024-03-04",
    icon: "log-out-outline" as const,
    color: STATUS_COLORS.error,
  },
] as const;

// ==================== CONFIGURATION DES STATUTS ====================
export const STATUS_CONFIG = {
  arrival: {
    label: "Arrivée",
    color: STATUS_COLORS.success,
    icon: "log-in-outline" as const,
    badge: "Présent",
    gradient: ["#D1FAE5", "#10B981"] as const,
  },
  departure: {
    label: "Départ",
    color: STATUS_COLORS.error,
    icon: "log-out-outline" as const,
    badge: "Sorti",
    gradient: ["#FEE2E2", "#EF4444"] as const,
  },
  break: {
    label: "Pause",
    color: STATUS_COLORS.warning,
    icon: "cafe-outline" as const,
    badge: "Pause",
    gradient: ["#FEF3C7", "#F59E0B"] as const,
  },
} as const;

// ==================== LAYOUT & DIMENSIONS ====================
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const LAYOUT = {
  screenWidth: width,
  screenHeight: Dimensions.get("window").height,

  // Cards
  cardWidth: (width - 44) / 2,
  cardHeight: 120,

  // Actions
  actionItemWidth: (width - 40 - 12) / 2,
  actionItemHeight: 80,

  // Margins et paddings
  padding: {
    horizontal: 20,
    vertical: 16,
    screen: 20,
  },

  // Gaps
  gap: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
  },

  // Bordures
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    xxl: 24,
    round: 999,
  },
} as const;

// ==================== ANIMATIONS ====================
export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  spring: {
    damping: 10,
    stiffness: 100,
    mass: 1,
    gentle: {
      damping: 15,
      stiffness: 80,
      mass: 1,
    },
    bouncy: {
      damping: 8,
      stiffness: 120,
      mass: 1,
    },
  },
  timing: {
    duration: 300,
    easing: "ease-in-out",
  },
} as const;

// ==================== STORAGE KEYS ====================
export const STORAGE_KEYS = {
  USER: "@user",
  PRESENCE: "@presence",
  SETTINGS: "@settings",
  THEME: "@theme",
  TOKEN: "@token",
  REFRESH_TOKEN: "@refresh_token",
} as const;

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
  PRESENCE: {
    BASE: "/api/presence",
    STATS: "/api/presences/stats",
    HISTORY: "/api/presences",
    TODAY: "/api/presences/today",
  },
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    REGISTER: "/api/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  USER: {
    PROFILE: "/api/user/profile",
    UPDATE: "/api/user/update",
    AVATAR: "/api/user/avatar",
  },
} as const;

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Récupère la configuration d'un type d'activité
 */
export const getActivityConfig = (type: keyof typeof STATUS_CONFIG) => {
  return STATUS_CONFIG[type] || STATUS_CONFIG.arrival;
};

/**
 * Récupère la couleur d'une action rapide par son ID
 */
export const getActionColor = (actionId: ActionId): string => {
  const action = ACTIONS_RAPIDES.find((a) => a.id === actionId);
  return action?.color || ACTION_COLORS.QR_CODE;
};

/**
 * Récupère le gradient d'une action rapide
 */
export const getActionGradient = (
  actionId: ActionId,
): readonly [string, string] => {
  const action = ACTIONS_RAPIDES.find((a) => a.id === actionId);
  return action?.gradient || [ACTION_COLORS.QR_CODE, "#2563EB"];
};

/**
 * Récupère les informations d'un jour par son index
 */
export const getDayInfo = (index: number) => {
  return WEEK_DAYS[index] || WEEK_DAYS[0];
};

/**
 * Formate une date pour l'affichage
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/**
 * Formate une date courte (JJ/MM/AAAA)
 */
export const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formate une heure pour l'affichage
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Formate une durée en heures et minutes
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins > 0 ? mins : ""}`;
};

/**
 * Vérifie si une date est aujourd'hui
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Vérifie si une date est dans la semaine courante
 */
export const isThisWeek = (date: Date): boolean => {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() + 6));
  return date >= weekStart && date <= weekEnd;
};
