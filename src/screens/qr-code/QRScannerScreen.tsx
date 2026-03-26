import { Buffer } from "buffer";
global.Buffer = Buffer;
import { getFontFamily } from "@/constants/typography";
import { AppStackParamList } from "@/navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Camera, CameraView } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { COLORS } from "../dashboard/constants/color";
import { getValidateQR } from "../dashboard/services/presenceService";

export const QRScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  useEffect(() => {
    (async () => {
      // Permission caméra
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus === "granted");

      // Récupérer la position GPS
      await getCurrentLocation();
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError("Permission de localisation refusée");
        console.error("Permission GPS refusée");
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

      console.log("Position GPS obtenue:", position.coords);
    } catch (error) {
      console.error("Erreur GPS:", error);
      setLocationError("Impossible de récupérer la position GPS");
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isVerifying) return;

    setScanned(true);
    setIsVerifying(true);
    Vibration.vibrate(100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      let code = data;
      if (data.includes("code=")) {
        const urlParams = new URLSearchParams(data.split("?")[1]);
        code = urlParams.get("code") || data;
      }

      console.log("QR Code scanné:", code);

      const payload = {
        code,
        latitude: location?.latitude,
        longitude: location?.longitude,
        accuracy: location?.accuracy,
      };

      const response = await getValidateQR(payload);

      if (response.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        navigation.replace("QRSuccess", {
          message: response.message,
          typeScan: response.data?.type_scan,
          siteName: response.data?.site_name,
          zoneName: response.data?.zone_name,
          distance: response.data?.distance,
          isWithinZone: response.data?.is_within_zone,
          retard_minutes: response.data?.retard_minutes,
          heures_supplementaires: response.data?.heures_supplementaires,
          scan_time: response.data?.scan_time,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Erreur:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      let errorMessage = error.message;
      let errorCode = error.code;

      if (error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
        errorCode = error.response.data.code;
      }

      if (errorCode === "OUT_OF_ZONE") {
        Alert.alert("Hors zone", errorMessage, [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      } else if (errorCode === "INVALID_QR") {
        Alert.alert(
          "QR Code invalide",
          "Ce QR code n'est pas valide ou a été désactivé",
          [{ text: "OK", onPress: () => setScanned(false) }],
        );
      } else if (errorCode === "NO_ACCESS") {
        Alert.alert("Accès refusé", "Vous n'avez pas accès à ce site", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else if (errorCode === "ALREADY_COMPLETE") {
        Alert.alert("Pointage déjà effectué", errorMessage, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Erreur", errorMessage, [
          { text: "OK", onPress: () => setScanned(false) },
        ]);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.main} />
        <Text style={styles.text}>Demande de permission caméra...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-off" size={48} color={COLORS.error.main} />
        <Text style={styles.text}>Accès caméra refusé</Text>
        <Text style={styles.subText}>
          Veuillez autoriser l'accès à la caméra dans les paramètres
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        flash={flashEnabled ? "on" : "off"}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scanner QR Code</Text>
            <TouchableOpacity
              onPress={() => setFlashEnabled(!flashEnabled)}
              style={styles.flashButton}
            >
              <Ionicons
                name={flashEnabled ? "flash" : "flash-off"}
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

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
            <View style={styles.gpsErrorStatus}>
              <Ionicons
                name="alert-circle"
                size={16}
                color={COLORS.error.main}
              />
              <Text style={styles.gpsErrorText}>
                {locationError} - Appuyez pour réessayer
              </Text>
            </View>
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
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.white,
  },
  scanArea: {
    width: 280,
    height: 280,
    alignSelf: "center",
    marginTop: 80,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary.main,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary.main,
  },
  cornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.primary.main,
  },
  cornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.primary.main,
  },
  instruction: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    textAlign: "center",
    marginTop: 40,
  },
  gpsStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    alignSelf: "center",
  },
  gpsErrorStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    alignSelf: "center",
  },
  gpsText: {
    color: COLORS.warning.main,
    fontSize: 12,
    marginLeft: 8,
    fontFamily: getFontFamily("regular"),
  },
  gpsSuccessText: {
    color: COLORS.success.main,
    fontSize: 12,
    marginLeft: 8,
    fontFamily: getFontFamily("regular"),
  },
  gpsErrorText: {
    color: COLORS.error.main,
    fontSize: 12,
    marginLeft: 8,
    fontFamily: getFontFamily("regular"),
  },
  verifyingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyingText: {
    color: COLORS.white,
    marginTop: 10,
    fontSize: 16,
    fontFamily: getFontFamily("medium"),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
  },
  subText: {
    fontSize: 14,
    color: COLORS.gray[600],
    textAlign: "center",
    marginTop: 8,
    fontFamily: getFontFamily("regular"),
  },
  button: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
  },
});

export default QRScannerScreen;
