import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StatusBar, View } from "react-native";
import { CameraView } from "./components/CameraView";
import { LoadingState } from "./components/LoadingState";
import { PermissionRequest } from "./components/PermissionRequest";
import { useQRScanner } from "./hooks/useQRScanner";
import { styles } from "./styles/QRScannerStyles";

export const QRScannerScreen = () => {
  const navigation = useNavigation();
  
  const {
    state,
    handleScan,
    requestCameraPermission,
    toggleFlash,
    retryLocation,
    resetScanner,
  } = useQRScanner({
    onScanSuccess: (data) => {
      console.log("Scan success:", data);
    },
    onScanError: (error) => {
      console.error("Scan error:", error);
    },
  });

  // Navigation
  const goBack = () => {
    navigation.goBack();
  };

  // État de chargement des permissions
  if (state.hasPermission === null) {
    return <LoadingState message="Demande de permission caméra..." />;
  }

  // Permission refusée
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
        onBarCodeScanned={handleScan}        // ✅ Utilisation directe
        onFlashToggle={toggleFlash}          // ✅ Utilisation directe
        onClose={goBack}
        onLocationRetry={retryLocation}      // ✅ Utilisation directe
      />
    </View>
  );
};

export default QRScannerScreen;