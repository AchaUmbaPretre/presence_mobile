import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { CameraView as ExpoCameraView } from "expo-camera";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/QRScannerStyles";
import { CameraViewProps } from "../types/qr.types";

export const CameraView: React.FC<CameraViewProps> = ({
  scanned,
  isVerifying,
  flashEnabled,
  location,
  locationError,
  onBarCodeScanned,
  onFlashToggle,
  onClose,
  onLocationRetry,
}) => {
  const handleScan = ({ data }: { data: string }) => {
    onBarCodeScanned(data);
  };

  return (
    <ExpoCameraView
      style={styles.camera}
      facing="back"
      flash={flashEnabled ? "on" : "off"}
      onBarcodeScanned={scanned ? undefined : handleScan}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scanner QR Code</Text>
          <TouchableOpacity onPress={onFlashToggle} style={styles.flashButton}>
            <Ionicons
              name={flashEnabled ? "flash" : "flash-off"}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* Zone de scan */}
        <View style={styles.scanArea}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        <Text style={styles.instruction}>
          Positionnez le QR code dans le cadre
        </Text>

        {!location && !locationError && (
          <View style={styles.gpsStatus}>
            <ActivityIndicator size="small" color={COLORS.warning.main} />
            <Text style={styles.gpsText}>
              Récupération de la position GPS...
            </Text>
          </View>
        )}

        {locationError && (
          <TouchableOpacity
            onPress={onLocationRetry}
            style={styles.gpsErrorStatus}
          >
            <Ionicons name="alert-circle" size={16} color={COLORS.error.main} />
            <Text style={styles.gpsErrorText}>
              {locationError} - Appuyez pour réessayer
            </Text>
          </TouchableOpacity>
        )}

        {location && !locationError && (
          <View style={styles.gpsStatus}>
            <Ionicons name="location" size={16} color={COLORS.success.main} />
            <Text style={styles.gpsSuccessText}>
              GPS OK (précision: {Math.round(location.accuracy)}m)
            </Text>
          </View>
        )}

        {isVerifying && (
          <View style={styles.verifyingOverlay}>
            <ActivityIndicator size="large" color={COLORS.white} />
            <Text style={styles.verifyingText}>Vérification en cours...</Text>
          </View>
        )}
      </View>
    </ExpoCameraView>
  );
};
