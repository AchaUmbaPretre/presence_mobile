export type PresenceStatus =
  | "PRESENT"
  | "ABSENT"
  | "RETARD"
  | "CONGE"
  | "MISSION"
  | "MALADIE";

export interface HistoryItems {
  id: string | number;
  date: string;
  heure_entree: string | null;
  heure_sortie: string | null;
  retard_minutes: number;
  heures_supplementaires: number;
  statut: PresenceStatus;
  site?: string;
  source?: "MANUEL" | "QR_CODE" | "GEOLOC" | "TERMINAL";
  is_locked?: boolean;
}

export interface HistoryFilters {
  startDate?: string;
  endDate?: string;
  status?: PresenceStatus[];
  search?: string;
  sortBy?: "date" | "retard" | "heures_supp";
  sortOrder?: "asc" | "desc";
}

export interface HistoryStats {
  total_jours: number;
  total_presents: number;
  total_absents: number;
  total_retards: number;
  total_heures: number;
  moyenne_heures: number;
}

export interface HistoryGroup {
  title: string;
  data: HistoryItem[];
}

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
  items: HistoryItem[];
  onItemPress?: (item: HistoryItem) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface HistoryItemProps {
  item: HistoryItem;
  onPress?: (item: HistoryItem) => void;
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
