import { AppStackParamList } from "@/navigation/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import { StatusBar, View } from "react-native";
import { CameraView } from "./components/CameraView";
import { LoadingState } from "./components/LoadingState";
import { PermissionRequest } from "./components/PermissionRequest";
import { useQRScanner } from "./hooks/useQRScanner";
import { styles } from "./styles/QRScannerStyles";
import { QRPayload } from "./types/qr.types";

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

const DEFAULT_VALUES = {
  type_scan: "ENTREE" as const,
  site_name: "Site",
  message: "Pointage enregistré avec succès",
} as const;

export const QRScannerScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const {
    state,
    handleScan,
    requestCameraPermission,
    toggleFlash,
    retryLocation,
    pauseScanner,
    resumeScanner,
  } = useQRScanner({
    onScanSuccess: (result: QRSuccessData) => {
      console.log("🎉 Scan réussi - Données reçues:", result);
      pauseScanner();

      const {
        type_scan = DEFAULT_VALUES.type_scan,
        site_name = DEFAULT_VALUES.site_name,
        zone_name,
        distance,
        is_within_zone,
        retard_minutes,
        heures_supplementaires,
        scan_time,
        message = DEFAULT_VALUES.message,
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
    },
    onScanError: (error: string) => {
      console.error("❌ QR Scan Error:", error);
      setTimeout(() => {
        resumeScanner();
      }, 2000);
    },
  });

  const goBack = useCallback(() => navigation.goBack(), [navigation]);

  useFocusEffect(
    useCallback(() => {
      console.log("📱 QRScannerScreen - Focus, reprise du scanner");
      resumeScanner();
      return () => {
        console.log("📱 QRScannerScreen - Blur");
      };
    }, [resumeScanner]),
  );

  if (state.hasPermission === null) {
    return <LoadingState message="Demande de permission caméra..." />;
  }

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
