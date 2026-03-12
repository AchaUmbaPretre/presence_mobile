export interface WeekDay {
  letter: string;
  present: boolean;
  partial: boolean;
  date: Date;
  heures?: number;
}


export interface WeekStats {
  present: number;
  partial: number;
  total: number;
}

export interface WeekPeriod {
  debut: string;
  fin: string;
}

export interface UseWeekIndicatorReturn {
  days: WeekDay[];
  stats: WeekStats;
  period: WeekPeriod;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  handleDayPress: (day: WeekDay, index: number) => void;
}
