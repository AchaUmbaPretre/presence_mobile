import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LocationInfo } from "./components/LocationInfo";
import { LocationMap } from "./components/LocationMap";
import { LocationPermission } from "./components/LocationPermission";
import { ZoneIndicator } from "./components/ZoneIndicator";
import { DEFAULT_SITE } from "./constants/geoloc.constants";
import { useLocation } from "./hooks/useLocation";

export const GeolocScreen = () => {
  const navigation = useNavigation();
  const [isPointing, setIsPointing] = useState(false);

  const {
    location,
    status,
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
    if (!status.isWithinZone) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!location) return;

    setIsPointing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simuler un appel API (à remplacer par votre vrai service)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Retour au dashboard après succès
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error(err);
    } finally {
      setIsPointing(false);
    }
  }, [status.isWithinZone, location, navigation]);

  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    getCurrentLocation();
  }, [getCurrentLocation]);

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

      {/* Header */}
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

        {/* Informations de localisation */}
        <LocationInfo status={status} isLoading={isLoading} />

        {/* Indicateur de zone */}
        <ZoneIndicator status={status} maxDistance={200} />

        {/* Bouton de pointage */}
        <TouchableOpacity
          style={[
            styles.pointageButton,
            (!status.isWithinZone || isPointing) &&
              styles.pointageButtonDisabled,
          ]}
          onPress={handlePointage}
          disabled={!status.isWithinZone || isPointing}
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
          <Text style={styles.infoTitle}>Site de pointage</Text>
          <Text style={styles.infoText}>{DEFAULT_SITE.name}</Text>
          <Text style={styles.infoAddress}>{DEFAULT_SITE.address}</Text>
          <Text style={styles.infoRadius}>
            Rayon autorisé: {DEFAULT_SITE.radius} mètres
          </Text>
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
  },
});

export default GeolocScreen;
