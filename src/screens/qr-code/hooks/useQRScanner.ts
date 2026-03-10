import { useState, useCallback, useRef } from 'react';
import { Alert, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { qrService } from '../services/qrService';
import { QRPayload, QRScanResult } from '../types/qr.types';

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
  const scanTimeout = useRef<NodeJS.Timeout>();

  const handleScan = useCallback(async (data: string) => {
    if (!isScanning || scanned) return;

    setScanned(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Vibration.vibrate(100);

    try {
      const result = await qrService.verifyAndDecode(data);
      setLastResult(result);

      if (result.success && result.data) {
        // Scanner réussi
        onScanSuccess?.(result.data);
        
        if (autoClose) {
          // Fermer après 2 secondes
          scanTimeout.current = setTimeout(() => {
            // Logique de fermeture
          }, 2000);
        }
      } else {
        // Scanner échoué
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        onScanError?.(result.message);
        
        Alert.alert(
          'QR Code invalide',
          result.message,
          [
            {
              text: 'Réessayer',
              onPress: () => {
                setScanned(false);
                setLastResult(null);
              },
            },
            { text: 'Annuler', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Erreur scan:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        'Erreur',
        'Impossible de lire le QR code',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  }, [isScanning, scanned, autoClose, onScanSuccess, onScanError]);

  const resetScanner = useCallback(() => {
    setScanned(false);
    setLastResult(null);
    setIsScanning(true);
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
    }
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
    setScanned(true);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const { status } = await requestPermission();
    return status === 'granted';
  }, [requestPermission]);

  return {
    permission,
    isScanning,
    scanned,
    lastResult,
    handleScan,
    resetScanner,
    stopScanning,
    requestCameraPermission,
  };
};