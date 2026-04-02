import { Ionicons } from "@expo/vector-icons";

export type SettingItemType =
  | "toggle"
  | "navigation"
  | "info"
  | "action"
  | "select"
  | "custom";

export interface SettingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  type: SettingItemType;
  onPress?: () => void;
  destructive?: boolean;
  badge?: number;
  disabled?: boolean;
  component?: string;
}

export interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
  component?: string;
}

export interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}

export interface SettingsState {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  biometricsEnabled: boolean;
  autoSyncEnabled: boolean;
  language: string;
  cacheSize: string;
}

export interface AppInfo {
  version: string;
  buildNumber: string;
}