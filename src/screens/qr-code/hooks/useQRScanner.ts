import { useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { Alert, Vibration } from "react-native";
import { qrService } from "../services/qrService";
import { QRPayload, QRScanResult } from "../types/qr.types";

interface UseQRScannerProps {
  onScanSuccess?: (data: QRPayload) => void;
  onScanError?: (error: string) => void;
  autoClose?: boolean;
}

export const useQRScanner = ({
  onScanSuccess,
  onScanError,
  autoClose = true,
}: UseQRScannerProps = {}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [lastResult, setLastResult] = useState<QRScanResult | null>(null);

  // ✅ CORRECTION: Initialiser avec null
  const scanTimeout = useRef<NodeJS.Timeout | null>(null);

  // ✅ handleScan reçoit maintenant une string (le data du QR code)
  const handleScan = useCallback(
    async (data: string) => {
      if (!isScanning || scanned) return;

      setScanned(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Vibration.vibrate(100);

      try {
        const result = await qrService.verifyAndDecode(data);
        setLastResult(result);

        if (result.success && result.data) {
          onScanSuccess?.(result.data);

          if (autoClose) {
            // ✅ Maintenant TypeScript sait que scanTimeout.current peut être null
            scanTimeout.current = setTimeout(() => {
              // Logique de fermeture
            }, 2000);
          }
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          onScanError?.(result.message);

          Alert.alert("QR Code invalide", result.message, [
            {
              text: "Réessayer",
              onPress: () => {
                setScanned(false);
                setLastResult(null);
              },
            },
            { text: "Annuler", style: "cancel" },
          ]);
        }
      } catch (error) {
        console.error("Erreur scan:", error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

        Alert.alert("Erreur", "Impossible de lire le QR code", [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      }
    },
    [isScanning, scanned, autoClose, onScanSuccess, onScanError],
  );

  const resetScanner = useCallback(() => {
    setScanned(false);
    setLastResult(null);
    setIsScanning(true);

    // ✅ Vérification que scanTimeout.current existe
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
      scanTimeout.current = null;
    }
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setScanned(true);
  }, []);

  return {
    permission,
    isScanning,
    scanned,
    lastResult,
    handleScan,
    resetScanner,
    stopScanning,
    requestCameraPermission: requestPermission,
  };
};
