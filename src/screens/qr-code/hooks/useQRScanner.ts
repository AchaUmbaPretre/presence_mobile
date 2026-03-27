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
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<QRScanResult | null>(null);
  const [lastError, setLastError] = useState<string | undefined>();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const scanTimeout = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

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

  // ==================== Contrôle du scanner ====================
  const pauseScanner = useCallback(() => {
    if (!isMounted.current) return;
    setIsScanning(false);
  }, []);

  const resumeScanner = useCallback(() => {
    if (!isMounted.current) return;
    setIsScanning(true);
    setScanned(false);
  }, []);

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

  // ==================== Feedback utilisateur ====================
  const triggerSuccessFeedback = useCallback(() => {
    if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (vibrationEnabled) Vibration.vibrate(100);
  }, [hapticEnabled, vibrationEnabled]);

  const triggerErrorFeedback = useCallback(() => {
    if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    if (vibrationEnabled) Vibration.vibrate(200);
  }, [hapticEnabled, vibrationEnabled]);

  const triggerWarningFeedback = useCallback(() => {
    if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [hapticEnabled]);

  // ==================== Gestion des erreurs ====================
  const showErrorAlert = useCallback((
    title: string,
    message: string,
    errorCode?: string,
    onRetry?: () => void
  ) => {
    // Cas spécial: pointage déjà effectué
    if (errorCode === 'ALREADY_COMPLETE') {
      Alert.alert(
        title,
        message,
        [{ text: "OK", onPress: () => { onScanEnd?.(); resetScanner(); } }],
        { cancelable: false }
      );
      return;
    }
    
    // Cas générique avec option réessayer
    Alert.alert(
      title,
      message,
      [
        { text: "Réessayer", onPress: () => onRetry ? onRetry() : resumeScanner() },
        { text: "Annuler", style: "cancel", onPress: () => resumeScanner() },
      ],
      { cancelable: false }
    );
  }, [resetScanner, onScanEnd, resumeScanner]);

  // ==================== Traitement du scan ====================
  const handleScan = useCallback(async (data: string) => {
    if (!isScanning || scanned || isProcessing) return;

    pauseScanner();
    setScanned(true);
    setIsProcessing(true);
    onScanStart?.();

    try {
      const result = await qrService.verifyAndDecode(data, location);
      
      if (!isMounted.current) return;
      
      setLastResult(result);
      if (!result.success) setLastError(result.message);

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
        
        // ✅ Utilisation de showErrorAlert
        showErrorAlert(
          result.error === 'ALREADY_COMPLETE' ? "Pointage déjà effectué" : "QR Code invalide",
          result.message,
          result.error,
          () => resumeScanner()
        );
      }
    } catch (error) {
      console.error("Erreur scan:", error);
      triggerErrorFeedback();
      
      const errorMessage = error instanceof Error ? error.message : "Impossible de lire le QR code";
      setLastError(errorMessage);
      
      if (isMounted.current) {
        // ✅ Utilisation de showErrorAlert pour les erreurs génériques
        showErrorAlert(
          "Erreur",
          `${errorMessage}. Veuillez réessayer.`,
          undefined,
          () => resumeScanner()
        );
      }
    } finally {
      if (isMounted.current) setIsProcessing(false);
    }
  }, [
    isScanning, scanned, isProcessing, location, autoClose, closeDelay,
    onScanStart, onScanSuccess, onScanError, onScanEnd,
    pauseScanner, resumeScanner, resetScanner,
    triggerSuccessFeedback, triggerErrorFeedback, showErrorAlert
  ]);

  // ==================== Actions du scanner ====================
  const stopScanning = useCallback(() => {
    if (!isMounted.current) return;
    setIsScanning(false);
    setScanned(true);
    onScanEnd?.();
  }, [onScanEnd]);

  const startScanning = useCallback(() => {
    if (!isMounted.current) return;
    resetScanner();
    onScanStart?.();
  }, [resetScanner, onScanStart]);

  // ==================== Permissions ====================
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
              onPress: () => Platform.OS === 'ios' 
                ? Linking.openURL('app-settings:') 
                : Linking.openSettings()
            },
          ]
        );
      }
    } catch (error) {
      console.error("Erreur demande permission:", error);
    }
  }, [requestPermission, triggerWarningFeedback]);

  // ==================== Interface utilisateur ====================
  const toggleFlash = useCallback(() => {
    setFlashEnabled(prev => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const goBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const retryLocation = useCallback(async () => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  // ==================== Effets ====================
  useEffect(() => {
    isMounted.current = true;
    getCurrentLocation();
    return () => {
      isMounted.current = false;
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
    };
  }, []);

  // ==================== State ====================
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
    pauseScanner,
    resumeScanner,
  };
};