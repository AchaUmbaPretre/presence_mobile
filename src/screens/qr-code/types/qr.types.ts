// types/qr.types.ts

import { ScanType } from "@/screens/qRSuccess/config/successConfig";

export interface QRPayload {
  type: "PRESENCE";
  terminalId: number;
  siteId: number;
  timestamp: number;
  expiresIn: number;
  signature?: string;
}
/* 
export interface QRScanResult {
  success: boolean;
  message: string;
  data?: QRPayload;
  error?: string;
  timestamp: number;
  terminalInfo?: TerminalInfo;
}
 */
// types/qr.types.ts
export interface QRScanResult {
  success: boolean;
  message: string;
  data?: QRPayload;
  error?: string;
  timestamp: number; // ✅ Obligatoire maintenant
  terminalInfo?: TerminalInfo;
  validationDetails?: {
    isValid: boolean;
    reason?: string;
    distance?: number;
    isWithinZone?: boolean;
  };
}

export interface QRScanState {
  isScanning: boolean;
  scanned: boolean;
  isProcessing: boolean;
  hasPermission: boolean;
  lastError?: string;
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
  autoClose?: boolean;
}

export interface QRResultProps {
  success: boolean;
  message: string;
  data?: QRPayload;
  terminalInfo?: TerminalInfo;
  onClose: () => void;
  onRetry?: () => void;
}

export interface QRSuccessParams {
  message: string;
  typeScan: ScanType;
  siteName: string;
  zoneName?: string;
  distance?: number;
  isWithinZone?: boolean;
  retard_minutes?: number;
  heures_supplementaires?: number;
  scan_time?: string;
}

export interface CameraViewProps {
  scanned: boolean;
  isVerifying: boolean;
  flashEnabled: boolean;
  location: any;
  locationError: string | null;
  onBarCodeScanned: (data: string) => void;
  onFlashToggle: () => void;
  onClose: () => void;
  onLocationRetry?: () => void;
}

export interface PermissionRequestProps {
  onRetry: () => void;
  onClose: () => void;
  message?: string;
}