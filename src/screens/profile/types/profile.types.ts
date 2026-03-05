import { Ionicons } from "@expo/vector-icons";

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  department: string;
  joinDate: string;
}

export interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  type: "navigation" | "toggle" | "info" | "action";
  onPress?: () => void;
  badge?: number;
  destructive?: boolean;
}

export interface StatItem {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export interface ProfileState {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  refreshing: boolean;
}
