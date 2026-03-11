export type PresenceStatus = 
  | "PRESENT" 
  | "ABSENT" 
  | "RETARD" 
  | "CONGE" 
  | "MISSION" 
  | "MALADIE"
  | "JOUR_NON_TRAVAILLE"
  | "JOUR_FERIE"
  | "ABSENCE_JUSTIFIEE"
  | "SUPPLEMENTAIRE";

export type SortBy = "date" | "retard" | "heures_supp";
export type SortOrder = "asc" | "desc";
export type SourceType = "MANUEL" | "QR_CODE" | "GEOLOC" | "TERMINAL";

// ==================== INTERFACES PRINCIPALES ====================

export interface HistoryItems {
  id: number;
  date: string;
  heure_entree: string | null;
  heure_sortie: string | null;
  retard_minutes: number;
  heures_supplementaires: number;
  statut: PresenceStatus;
  source: SourceType;
  is_locked: boolean;
  site?: string;
  details?: {
    heures_travaillees?: number;
    utilisateur?: string;
  };
}

export interface HistoryStats {
  total_jours: number;
  total_presents: number;
  total_absents: number;
  total_retards: number;
  total_non_travailles: number;
  total_feries: number;
  total_justifies: number;
  total_heures_supp: number;
  moyenne_heures: number;
  total_retard_minutes: number;
  objectif_hebdo: number;
  objectif_atteint: number;
  sites_visites: number,
  derniere_presence: string | null;
  repartition: {
    present: number;
    absent: number;
    justifie: number;
    ferie: number;
    non_travaille: number;
    supplementaire: number;
  };
}

export interface HistoryFilters {
  startDate?: string;
  endDate?: string;
  status?: PresenceStatus[];
  search?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface HistoryResponse {
  historique: HistoryItems[];
  stats: HistoryStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface HistoryGroup {
  title: string;
  data: HistoryItems[];
}

// ==================== PROPS POUR LES COMPOSANTS ====================

export interface HistoryHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onFilter?: () => void;
  onExport?: () => void;
}

export interface HistoryFiltersProps {
  filters: HistoryFilters;
  onFilterChange: (filters: HistoryFilters) => void;
  onApply: () => void;
  onReset: () => void;
  visible: boolean;
  onClose: () => void;
}

export interface HistoryListProps {
  items: HistoryItems[];
  onItemPress?: (item: HistoryItems) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface HistoryItemProps {
  item: HistoryItems;
  onPress?: (item: HistoryItems) => void;
  showActions?: boolean;
}

export interface HistoryStatsProps {
  stats: HistoryStats;
  period?: string;
}

export interface HistoryEmptyProps {
  message?: string;
  onRefresh?: () => void;
}
