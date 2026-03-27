export type AppStackParamList = {
  Tabs: undefined;
  QRScanner: undefined;
  QRSuccess: {
    message: string;
    typeScan: string;
    siteName: string;
    siteId?: number;
    zoneName?: string;
    zoneId?: number;
    distance?: number;
    isWithinZone?: boolean;
    retard_minutes?: number;
    heures_supplementaires?: number;
    scan_time?: string; 
    jour_non_travaille?: boolean; 
    is_new_record?: boolean;
  };
  Geoloc: undefined;
  Historique: undefined;
  Rapports: undefined;
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
