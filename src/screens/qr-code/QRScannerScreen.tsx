// screens/qr-code/QRScannerScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { StatusBar, View } from "react-native";
import { AppStackParamList } from "@/navigation/AppNavigator";
import { CameraView } from "./components/CameraView";
import { LoadingState } from "./components/LoadingState";
import { PermissionRequest } from "./components/PermissionRequest";
import { useQRScanner } from "./hooks/useQRScanner";
import { styles } from "./styles/QRScannerStyles";
import { QRPayload } from "./types/qr.types";

// Type pour les données de succès
interface QRSuccessData extends QRPayload {
  message?: string;
  type_scan?: "ENTREE" | "SORTIE";
  site_name?: string;
  zone_name?: string;
  distance?: number;
  is_within_zone?: boolean;
  retard_minutes?: number;
  heures_supplementaires?: number;
  scan_time?: string;
}

const DEFAULT_PARAMS = {
  type_scan: "ENTREE" as const,
  site_name: "Site",
  message: "Pointage enregistré avec succès",
} as const;

export const QRScannerScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  
  const { state, handleScan, requestCameraPermission, toggleFlash, retryLocation } = useQRScanner({
    onScanSuccess: useCallback((result: QRSuccessData) => {
      const { 
        type_scan = DEFAULT_PARAMS.type_scan,
        site_name = DEFAULT_PARAMS.site_name,
        zone_name,
        distance,
        is_within_zone,
        retard_minutes,
        heures_supplementaires,
        scan_time,
        message = DEFAULT_PARAMS.message,
      } = result;

      navigation.navigate("QRSuccess", {
        message,
        typeScan: type_scan,
        siteName: site_name,
        zoneName: zone_name,
        distance,
        isWithinZone: is_within_zone,
        retard_minutes,
        heures_supplementaires,
        scan_time: scan_time || new Date().toISOString(),
      });
    }, [navigation]),
    onScanError: useCallback((error: string) => {
      console.error("Scan error:", error);
    }, []),
  });

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  if (state.hasPermission === null) return <LoadingState message="Demande de permission caméra..." />;
  if (state.hasPermission === false) {
    return (
      <PermissionRequest
        onRetry={requestCameraPermission}
        onClose={goBack}
        message="Veuillez autoriser l'accès à la caméra pour scanner les QR codes"
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <CameraView
        scanned={state.scanned}
        isVerifying={state.isProcessing}
        flashEnabled={state.flashEnabled}
        location={state.location}
        locationError={state.locationError}
        onBarCodeScanned={handleScan}
        onFlashToggle={toggleFlash}
        onClose={goBack}
        onLocationRetry={retryLocation}
      />
    </View>
  );
};

export default QRScannerScreen;