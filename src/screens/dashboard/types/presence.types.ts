export interface PresenceState {
  heure_entree: string | null;
  heure_sortie: string | null;
  retard_minutes: number;
  heures_supplementaires: number;
}

export type ActionType = 'ENTREE' | 'SORTIE';

export interface PointageRequest {
  id_utilisateur: number;
  date_presence: string;
  datetime: string;
  source: 'MANUEL' | 'QR_CODE' | 'GEOLOC';
  permissions: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface MetricItem {
  value: number;
  unit: string;
  label: string;
  color?: string;
}