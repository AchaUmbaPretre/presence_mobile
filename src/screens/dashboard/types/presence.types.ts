export interface PresenceState {
  heure_entree: string | null;
  heure_sortie: string | null;
  retard_minutes: number;
  heures_supplementaires: number;
}

export type ActionType = "ENTREE" | "SORTIE";

// 👇 AJOUTER CE TYPE - Export du type PointageSource
export type PointageSource = "MANUEL" | "QR_CODE" | "GEOLOC";

export interface PointageRequest {
  id_utilisateur: number;
  date_presence: string;
  datetime: string;
  source: PointageSource; // Utilisation du type
  permissions: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PointageResponse {
  success: boolean;
  message: string;
  data?: {
    heure_entree?: string;
    heure_sortie?: string;
    retard_minutes?: number;
    heures_supplementaires?: number;
  };
}

export interface ActivityItem {
  id: string;
  type: "arrival" | "departure" | "break";
  time: string;
  status: string;
  date: string;
}

export interface WeekDay {
  letter: string;
  present: boolean;
  partial: boolean;
  date: Date;
  heures?: number;
}

export interface HeaderProps {
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
}
