import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { LocationInfo } from "./components/LocationInfo";
import { LocationMap } from "./components/LocationMap";
import { LocationPermission } from "./components/LocationPermission";
import { ZoneIndicator } from "./components/ZoneIndicator";
import { DEFAULT_SITE } from "./constants/geoloc.constants";
import { useLocation } from "./hooks/useLocation";
import { locationService } from "./services/locationService";
import { PointageLocation } from "./types/geoloc.types";

export const GeolocScreen = () => {
  const navigation = useNavigation();
  const [isPointing, setIsPointing] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const {
    location,
    status,
    zoneVerification,
    error,
    isLoading,
    permission,
    getCurrentLocation,
    requestPermission,
  } = useLocation({
    siteCoordinates: DEFAULT_SITE.coordinates,
    siteRadius: DEFAULT_SITE.radius,
  });

  const handlePointage = useCallback(async () => {
    // Vérification 1: Utilisateur connecté
    if (!currentUser?.id) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("❌ Erreur", "Utilisateur non connecté");
      return;
    }

    // Vérification 2: Dans la zone (via API ou local)
    if (!status.isWithinZone) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Message plus précis si on a des infos de l'API
      if (zoneVerification?.data?.zone_plus_proche) {
        const zoneProche = zoneVerification.data.zone_plus_proche;
        Alert.alert(
          "❌ Hors zone",
          `Vous êtes à ${zoneProche.distance}m de "${zoneProche.nom_site}". Rapprochez-vous pour pointer.`
        );
      } else {
        Alert.alert("❌ Hors zone", "Vous devez être dans la zone pour pointer");
      }
      return;
    }

    // Vérification 3: Position disponible
    if (!location) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("❌ Erreur", "Position non disponible");
      return;
    }

    setIsPointing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Préparer les données de localisation
      const pointageLocation: PointageLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: Date.now(),
      };

      // Appel au service d'enregistrement
      const result = await locationService.recordPointageWithLocation(
        currentUser.id,
        pointageLocation
      );

      if (result?.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Message personnalisé si on a des infos de zone
        const zoneName = zoneVerification?.data?.zone?.nom_site || DEFAULT_SITE.name;
        
        Alert.alert(
          "✅ Pointage réussi",
          `Votre présence a été enregistrée sur "${zoneName}"`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        throw new Error(result?.message || "Erreur de pointage");
      }
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "❌ Erreur",
        err.message || "Impossible d'enregistrer le pointage"
      );
      console.error("Erreur pointage:", err);
    } finally {
      setIsPointing(false);
    }
  }, [status.isWithinZone, location, navigation, currentUser?.id, zoneVerification]);

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    getCurrentLocation();
  }, [getCurrentLocation]);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning" size={48} color={COLORS.warning.main} />
          <Text style={styles.errorTitle}>Erreur de localisation</Text>
          <Text style={styles.errorText}>{error.message}</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleRefresh}>
            <Text style={styles.errorButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <LocationPermission
          onRequestPermission={requestPermission}
          onClose={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pointage par géolocalisation</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isLoading}
        >
          <Ionicons
            name="refresh"
            size={24}
            color={isLoading ? COLORS.gray[400] : COLORS.primary.main}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Carte */}
        <View style={styles.mapContainer}>
          <LocationMap
            siteCoordinates={DEFAULT_SITE.coordinates}
            userLocation={location?.coords}
            radius={DEFAULT_SITE.radius}
            isWithinZone={status.isWithinZone}
          />
        </View>

        <LocationInfo status={status} isLoading={isLoading} />

        {/* Indicateur de zone */}
        <ZoneIndicator status={status} maxDistance={200} />

        {zoneVerification?.data?.zone && (
          <View style={styles.apiInfoBox}>
            <Text style={styles.apiInfoTitle}>Site détecté</Text>
            <Text style={styles.apiInfoText}>
              {zoneVerification.data.zone.nom_site}
            </Text>
            {zoneVerification.data.zone.est_principal && (
              <View style={styles.principalBadge}>
                <Text style={styles.principalBadgeText}>Site principal</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.pointageButton,
            (!status.isWithinZone || isPointing || isLoading) &&
              styles.pointageButtonDisabled,
          ]}
          onPress={handlePointage}
          disabled={!status.isWithinZone || isPointing || isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              status.isWithinZone
                ? [COLORS.success.main, COLORS.success.dark]
                : [COLORS.gray[400], COLORS.gray[500]]
            }
            style={styles.pointageButtonGradient}
          >
            {isPointing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name={
                    status.isWithinZone ? "checkmark-circle" : "alert-circle"
                  }
                  size={24}
                  color={COLORS.white}
                />
                <Text style={styles.pointageButtonText}>
                  {status.isWithinZone ? "Pointer maintenant" : "Hors zone"}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Informations complémentaires */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Site de pointage par défaut</Text>
          <Text style={styles.infoText}>{DEFAULT_SITE.name}</Text>
          <Text style={styles.infoAddress}>{DEFAULT_SITE.address}</Text>
          <Text style={styles.infoRadius}>
            Rayon autorisé: {DEFAULT_SITE.radius} mètres
          </Text>
          {location?.coords.accuracy && (
            <Text style={styles.infoAccuracy}>
              Précision GPS: {Math.round(location.coords.accuracy)} mètres
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
  },
  mapContainer: {
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pointageButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  pointageButtonDisabled: {
    opacity: 0.7,
  },
  pointageButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  pointageButtonText: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.white,
  },
  infoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  infoAddress: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    marginBottom: 8,
  },
  infoRadius: {
    fontSize: 13,
    fontFamily: getFontFamily("regular"),
    color: COLORS.primary.main,
    marginBottom: 4,
  },
  infoAccuracy: {
    fontSize: 13,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.white,
  },
  apiInfoBox: {
    backgroundColor: COLORS.primary.light + '20',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary.main + '40',
  },
  apiInfoTitle: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    marginBottom: 2,
  },
  apiInfoText: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.primary.main,
  },
  principalBadge: {
    backgroundColor: COLORS.primary.main,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  principalBadgeText: {
    fontSize: 10,
    fontFamily: getFontFamily("medium"),
    color: COLORS.white,
  },
});

export default GeolocScreen;