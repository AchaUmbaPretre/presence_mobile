
export interface NotificationPayload {
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
}

export interface ReminderConfig {
  enabled: boolean;
  checkInTime: string; // "08:00"
  checkOutTime: string; // "17:00"
  reminderBeforeMinutes: number; // 15
}