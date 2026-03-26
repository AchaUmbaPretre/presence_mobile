export interface QRPayload {
  type: 'PRESENCE';
  terminalId: number;
  siteId: number;
  timestamp: number;
  expiresIn: number;
  signature?: string;
}

export interface QRScanResult {
  success: boolean;
  data?: QRPayload;
  message: string;
  terminalInfo?: TerminalInfo;
}

export interface TerminalInfo {
  id: number;
  name: string;
  siteId: number;
  siteName: string;
  isEnabled: boolean;
}

export interface QRGeneratorProps {
  terminalId: number;
  siteId: number;
  size?: number;
  onGenerate?: (qrData: string) => void;
}

export interface QRScannerProps {
  onScan: (data: QRPayload) => void;
  onClose: () => void;
  onError?: (error: string) => void;
}

export interface QRResultProps {
  success: boolean;
  message: string;
  data?: QRPayload;
  terminalInfo?: TerminalInfo;
  onClose: () => void;
  onRetry?: () => void;
}

/* type RootStackParamList = {
  Tabs: undefined;
  Historique: undefined;
  QRSuccess: {
    message: string;
    typeScan: ScanType;
    siteName: string;
    zoneName?: string;
    distance?: number;
    isWithinZone?: boolean;
    retard_minutes?: number;
    heures_supplementaires?: number;
    scan_time?: string;
  };
}; */