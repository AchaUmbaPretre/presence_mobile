import { Ionicons } from "@expo/vector-icons";

export type ReportPeriod = "day" | "week" | "month" | "quarter" | "year" | "custom";
export type ReportFormat = "pdf" | "excel" | "csv";

export interface ReportChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;  
    label?: string;
  }[];
}

export interface ReportFilters {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  userId?: number;
  siteId?: number;
  departmentId?: number;
}

export interface ReportSummary {
  total_presences: number;
  total_absences: number;
  total_retards: number;
  total_heures_travaillees: number;
  total_heures_supp: number;
  taux_presence: number;
  moyenne_heures_jour: number;
  jours_travailles: number;
}

export interface ReportData {
  id: string | number;
  date: string;
  present: number;
  absent: number;
  retard: number;
  conge: number;
  mission: number;
  maladie: number;
}

export interface ReportChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;
    label?: string;
  }[];
}

export interface ReportStats {
  summary: ReportSummary;
  chartData: ReportChartData;
  tableData: ReportData[];
  period: string;
  generatedAt: string;
}

export interface ReportHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export interface ReportPeriodSelectorProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
  onDateRangeChange?: (start: string, end: string) => void;
  startDate?: string;
  endDate?: string;
}

export interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

export interface ReportChartProps {
  data: ReportChartData;
  type?: "bar" | "line" | "pie";
  height?: number;
}

export interface ReportStatsTableProps {
  data: ReportData[];
  onRowPress?: (item: ReportData) => void;
}

export interface ReportExportButtonProps {
  onExport: (format: ReportFormat) => void;
  loading?: boolean;
}

export interface ReportEmptyProps {
  message?: string;
  onRefresh?: () => void;
}