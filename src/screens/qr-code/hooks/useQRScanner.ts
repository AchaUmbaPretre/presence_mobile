import { useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState, useEffect } from "react";
import { Alert, Vibration, Platform, Linking } from "react-native";
import * as Location from "expo-location";
import { qrService } from "../services/qrService";
import { QRScanResult, QRScanState, UseQRScannerProps, UseQRScannerReturn } from "../types/qr.types";

export const useQRScanner = ({
  onScanSuccess,
  onScanError,
  onScanStart,
  onScanEnd,
  autoClose = true,
  closeDelay = 2000,
  vibrationEnabled = true,
  hapticEnabled = true,
}: UseQRScannerProps = {}): UseQRScannerReturn => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [scanned, setScanned] = useState(false);
  const [lastResult, setLastResult] = useState<QRScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastError, setLastError] = useState<string | undefined>();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const scanTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Récupération de la position GPS
  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission de localisation refusée");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setLocationError(null);
    } catch (error) {
      console.error("Erreur GPS:", error);
      setLocationError("Impossible de récupérer la position GPS");
    }
  }, []);

  // ✅ Déclaration de resetScanner AVANT de l'utiliser dans showErrorAlert
  const resetScanner = useCallback(() => {
    if (!isMounted.current) return;
    
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
      scanTimeout.current = null;
    }
    
    setScanned(false);
    setLastResult(null);
    setLastError(undefined);
    setIsScanning(true);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    getCurrentLocation();
    return () => {
      isMounted.current = false;
      if (scanTimeout.current) {
        clearTimeout(scanTimeout.current);
      }
    };
  }, []);

  // Feedback haptique et vibration
  const triggerSuccessFeedback = useCallback(() => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (vibrationEnabled) {
      Vibration.vibrate(100);
    }
  }, [hapticEnabled, vibrationEnabled]);

  const triggerErrorFeedback = useCallback(() => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    if (vibrationEnabled) {
      Vibration.vibrate(200);
    }
  }, [hapticEnabled, vibrationEnabled]);

  const triggerWarningFeedback = useCallback(() => {
    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [hapticEnabled]);

  // Gestion de l'erreur avec alert
  const showErrorAlert = useCallback((
    title: string,
    message: string,
    onRetry?: () => void
  ) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Réessayer",
          onPress: () => {
            if (onRetry) {
              onRetry();
            } else {
              resetScanner();
            }
          },
        },
        { text: "Annuler", style: "cancel" },
      ],
      { cancelable: false }
    );
  }, [resetScanner]);

  // Traitement du scan
  const handleScan = useCallback(async (data: string) => {
    if (!isScanning || scanned || isProcessing) return;

    setIsProcessing(true);
    setScanned(true);
    setIsScanning(false);

    onScanStart?.();

    try {
      const result = await qrService.verifyAndDecode(data);
      
      if (!isMounted.current) return;
      
      setLastResult(result);
      
      if (!result.success) {
        setLastError(result.message);
      }

      if (result.success && result.data) {
        triggerSuccessFeedback();
        
        onScanSuccess?.(result.data);

        if (autoClose) {
          scanTimeout.current = setTimeout(() => {
            if (isMounted.current) {
              onScanEnd?.();
              resetScanner();
            }
          }, closeDelay);
        }
      } else {
        triggerErrorFeedback();
        onScanError?.(result.message);
        
        showErrorAlert("QR Code invalide", result.message, () => {
          resetScanner();
        });
      }
    } catch (error) {
      console.error("Erreur scan:", error);
      triggerErrorFeedback();
      
      const errorMessage = error instanceof Error ? error.message : "Impossible de lire le QR code";
      setLastError(errorMessage);
      
      if (isMounted.current) {
        showErrorAlert(
          "Erreur",
          `${errorMessage}. Veuillez réessayer.`,
          () => resetScanner()
        );
      }
    } finally {
      if (isMounted.current) {
        setIsProcessing(false);
      }
    }
  }, [
    isScanning,
    scanned,
    isProcessing,
    autoClose,
    closeDelay,
    onScanStart,
    onScanEnd,
    onScanSuccess,
    onScanError,
    triggerSuccessFeedback,
    triggerErrorFeedback,
    showErrorAlert,
    resetScanner,
  ]);

  // Arrêt du scanning
  const stopScanning = useCallback(() => {
    if (!isMounted.current) return;
    
    setIsScanning(false);
    setScanned(true);
    onScanEnd?.();
  }, [onScanEnd]);

  // Démarrage du scanning
  const startScanning = useCallback(() => {
    if (!isMounted.current) return;
    
    resetScanner();
    onScanStart?.();
  }, [resetScanner, onScanStart]);

  // Demande de permission caméra
  const requestCameraPermission = useCallback(async (): Promise<void> => {
    try {
      const result = await requestPermission();
      if (!result.granted && isMounted.current) {
        triggerWarningFeedback();
        Alert.alert(
          "Permission requise",
          "L'accès à la caméra est nécessaire pour scanner les QR codes.",
          [
            { text: "OK", style: "default" },
            { 
              text: "Paramètres", 
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }
            },
          ]
        );
      }
    } catch (error) {
      console.error("Erreur demande permission:", error);
    }
  }, [requestPermission, triggerWarningFeedback]);

  // Toggle flash
  const toggleFlash = useCallback(() => {
    setFlashEnabled(prev => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const goBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Retry location
  const retryLocation = useCallback(async () => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  const state: QRScanState & {
    flashEnabled: boolean;
    location: any;
    locationError: string | null;
  } = {
    isScanning,
    scanned,
    isProcessing,
    hasPermission: permission?.granted ?? false,
    lastError,
    flashEnabled,
    location,
    locationError,
  };

  return {
    permission,
    state,
    lastResult,
    isScanning,
    scanned,
    handleScan,
    resetScanner,
    stopScanning,
    startScanning,
    requestCameraPermission,
    toggleFlash,
    goBack,
    retryLocation,
  };
};