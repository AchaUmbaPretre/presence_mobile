export interface QRScannerState {
  hasPermission: boolean | null;
  scanned: boolean;
  isVerifying: boolean;
  flashEnabled: boolean;
  location: any;
  locationError: string | null;
}

export interface QRScannerHandlers {
  handleBarCodeScanned: (data: string) => void;
  toggleFlash: () => void;
  goBack: () => void;
}
