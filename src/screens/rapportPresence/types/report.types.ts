// src/features/reports/types/report.types.ts

export type ReportPeriod = "day" | "week" | "month" | "quarter" | "year" | "custom";
export type ReportFormat = "pdf" | "excel" | "csv";

export interface ReportFilters {
  userId?: number;
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
  year?: number;
  month?: number;
}

export interface ReportSummary {
  total_jours: number;
  total_presents: number;
  total_absents: number;
  total_retards: number;
  total_heures_supp: number;
  total_retard_minutes: number;
  moyenne_heures: number; 
  taux_presence: number;
  total_non_travailles: number;
  total_feries: number;
  total_justifies: number;
}

export interface ReportChartDataset {
  data: number[];
  color: string;
  label: string;
}

export interface ReportChartData {
  labels: string[];
  datasets: ReportChartDataset[];
}

export interface ReportTableData {
  id: number | string;
  date: string;
  present: number;
  absent: number;
  retard: number;
  conge: number;
  mission: number;
  maladie: number;
}

export interface ReportStats {
  summary: ReportSummary;
  chartData: ReportChartData;
  tableData: ReportTableData[];
  period: string;
  generatedAt: string;
}

export interface ReportResponse {
  success: boolean;
  data: {
    periode: {
      debut: string;
      fin: string;
      libelle: string;
    };
    summary: ReportSummary;
    chartData: ReportChartData;
    tableData: ReportTableData[];
    generatedAt: string;
  };
}

// Props des composants (déjà existants)
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
  data: ReportTableData[];
  onRowPress?: (item: ReportTableData) => void;
}

export interface ReportExportButtonProps {
  onExport: (format: ReportFormat) => void;
  loading?: boolean;
}

export interface ReportEmptyProps {
  message?: string;
  onRefresh?: () => void;
}