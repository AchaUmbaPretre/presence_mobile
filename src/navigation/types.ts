// navigation/types.ts
export type AppStackParamList = {
  Tabs: undefined;
  QRScanner: undefined;
  QRSuccess: {
    message: string;
    typeScan: "ENTREE" | "SORTIE";
    siteName: string;
    zoneName?: string;
    distance?: number;
    isWithinZone?: boolean;
    retard_minutes?: number;
    heures_supplementaires?: number;
    scan_time?: string;
  };
  Geoloc: undefined;
  Historique: undefined;
  Rapports: undefined;
  NotificationSettings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  QRScanner: undefined;
  Geoloc: undefined;
  Historique: undefined;
  Rapports: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
};
