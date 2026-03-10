import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { CameraView, BarcodeScanningResult } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useQRScanner } from "../hooks/useQRScanner";
import { QRScannerProps } from "../types/qr.types";

const { width } = Dimensions.get("window");
const SCAN_AREA_SIZE = width * 0.7;

export const QRScanner: React.FC<QRScannerProps> = ({
  onScan,
  onClose,
  onError,
}) => {
  const {
    permission,
    scanned,
    handleScan,
    resetScanner,
    requestCameraPermission,
  } = useQRScanner({
    onScanSuccess: onScan,
    onScanError: onError,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleRetry = () => {
    setIsLoading(false);
    resetScanner();
  };

  // ✅ Adapter handleScan pour recevoir BarcodeScanningResult
  const onBarcodeScanned = (result: BarcodeScanningResult) => {
    handleScan(result.data);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[COLORS.gray[50], COLORS.white]}
          style={styles.permissionContainer}
        >
          <Ionicons
            name="camera-outline"
            size={60}
            color={COLORS.primary.main}
          />
          <Text style={styles.permissionTitle}>Accès caméra requis</Text>
          <Text style={styles.permissionText}>
            Nous avons besoin d'accéder à votre caméra pour scanner les QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}
          >
            <LinearGradient
              colors={[COLORS.primary.main, COLORS.primary.dark]}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>
                Autoriser la caméra
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        {/* Overlay avec effet de flou */}
        <BlurView
          intensity={Platform.OS === "ios" ? 20 : 100}
          style={styles.overlay}
        >
          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              {/* Coins de scan */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* Animation de scan */}
              {!scanned && <View style={styles.scanLine} />}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.instruction}>
              {scanned
                ? "QR code scanné avec succès !"
                : "Placez le QR code dans le cadre"}
            </Text>

            {scanned && (
              <View style={styles.successContainer}>
                <ActivityIndicator size="small" color={COLORS.success.main} />
                <Text style={styles.successText}>Vérification en cours...</Text>
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={scanned ? handleRetry : undefined}
                disabled={!scanned}
              >
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color={scanned ? COLORS.white : COLORS.gray[400]}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    !scanned && styles.actionButtonTextDisabled,
                  ]}
                >
                  Réessayer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={onClose}>
                <Ionicons name="close-outline" size={24} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
  },
  scanArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrame: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: COLORS.white,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary.main,
    shadowColor: COLORS.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    transform: [{ translateY: SCAN_AREA_SIZE / 2 }],
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: 16,
    fontFamily: getFontFamily("medium"),
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    overflow: "hidden",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  successText: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.success.main,
    marginLeft: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  actionButton: {
    alignItems: "center",
    opacity: 0.9,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.white,
    marginTop: 4,
  },
  actionButtonTextDisabled: {
    color: COLORS.gray[400],
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionTitle: {
    fontSize: 22,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    marginTop: 20,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  permissionButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  permissionButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.white,
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[500],
  },
});