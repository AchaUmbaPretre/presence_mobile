import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import MapView, {
    Circle,
    Marker,
    PROVIDER_GOOGLE
} from "react-native-maps";
import { ZONE_COLORS } from "../constants/geoloc.constants";


const MapLegend: React.FC<{ isWithinZone?: boolean; distance?: number }> = ({
  isWithinZone,
  distance,
}) => {
  const getStatusText = useMemo(() => {
    if (isWithinZone === undefined) return "🟡 Position inconnue";
    return isWithinZone ? "✅ Dans la zone" : "❌ Hors zone";
  }, [isWithinZone]);

  const getStatusColor = useMemo(() => {
    if (isWithinZone === undefined) return COLORS.gray[400];
    return isWithinZone ? COLORS.success.main : COLORS.error.main;
  }, [isWithinZone]);

  return (
    <BlurView intensity={80} tint="dark" style={styles.legendContainer}>
      <View style={styles.legendContent}>
        <View style={[styles.legendDot, { backgroundColor: getStatusColor }]} />
        <Text style={styles.legendText}>{getStatusText}</Text>
        {distance !== undefined && (
          <Text style={styles.legendDistance}>
            •{" "}
            {distance < 1000
              ? `${Math.round(distance)}m`
              : `${(distance / 1000).toFixed(1)}km`}
          </Text>
        )}
      </View>
    </BlurView>
  );
};

export const LocationMap: React.FC<LocationMapProps> = ({
  siteCoordinates,
  userLocation,
  radius,
  isWithinZone,
  onMapReady,
  onRegionChange,
}) => {
  const mapRef = useRef<MapView>(null);
  const isFirstRender = useRef(true);

  // Calculer la distance entre l'utilisateur et le site
  const distance = useMemo(() => {
    if (!userLocation) return undefined;

    const R = 6371e3;
    const φ1 = (userLocation.latitude * Math.PI) / 180;
    const φ2 = (siteCoordinates.latitude * Math.PI) / 180;
    const Δφ =
      ((siteCoordinates.latitude - userLocation.latitude) * Math.PI) / 180;
    const Δλ =
      ((siteCoordinates.longitude - userLocation.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, [userLocation, siteCoordinates]);

  // Animation vers la position utilisateur
  useEffect(() => {
    if (userLocation && mapRef.current) {
      // Éviter l'animation au premier rendu si c'est déjà la région initiale
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  }, [userLocation]);

  // Fonction pour centrer la carte sur l'utilisateur
  const centerOnUser = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
  }, [userLocation]);

  // Couleur de la zone avec mémoïsation
  const zoneColor = useMemo(() => {
    if (isWithinZone === undefined) return ZONE_COLORS.neutral;
    return isWithinZone ? ZONE_COLORS.authorized : ZONE_COLORS.forbidden;
  }, [isWithinZone]);

  const initialRegion = useMemo(
    () => ({
      ...siteCoordinates,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    }),
    [siteCoordinates],
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        loadingEnabled
        loadingIndicatorColor={COLORS.primary.main}
        loadingBackgroundColor={COLORS.background}
        onMapReady={onMapReady}
        onRegionChangeComplete={onRegionChange}
        googleMapId={Platform.OS === "android" ? "YOUR_MAP_ID" : undefined}
      >
        <Circle
          center={siteCoordinates}
          radius={radius}
          fillColor={zoneColor + "20"}
          strokeColor={zoneColor}
          strokeWidth={2}
          lineDashPattern={isWithinZone === false ? [5, 5] : undefined}
        />

        {/* Marqueur du site */}
        <Marker
          coordinate={siteCoordinates}
          title="Site de pointage"
          description={`Rayon: ${radius}m`}
        >
          <View style={styles.siteMarker}>
            <Ionicons name="business" size={24} color={COLORS.white} />
          </View>
        </Marker>

        {/* Marqueur utilisateur personnalisé (optionnel) */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Votre position"
            description={`Distance: ${distance ? Math.round(distance) : "?"}m`}
            onPress={centerOnUser}
          >
            <View
              style={[
                styles.userMarker,
                isWithinZone ? styles.userMarkerSafe : styles.userMarkerWarning,
              ]}
            >
              <Ionicons name="person" size={16} color={COLORS.white} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Bouton de recentrage */}
      {userLocation && (
        <TouchableOpacity
          style={styles.centerButton}
          onPress={centerOnUser}
          activeOpacity={0.7}
        >
          <BlurView intensity={80} tint="light" style={styles.centerButtonBlur}>
            <Ionicons name="locate" size={20} color={COLORS.primary.main} />
          </BlurView>
        </TouchableOpacity>
      )}

      {userLocation && (
        <MapLegend isWithinZone={isWithinZone} distance={distance} />
      )}
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  siteMarker: {
    backgroundColor: COLORS.primary.main,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  userMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  userMarkerSafe: {
    backgroundColor: COLORS.success.main,
  },
  userMarkerWarning: {
    backgroundColor: COLORS.error.main,
  },
  // Styles pour la légende
  legendContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 20,
    overflow: "hidden",
    padding: 12,
  },
  legendContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.white,
  },
  legendDistance: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.white + "CC",
  },
  // Bouton de recentrage
  centerButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 30,
    overflow: "hidden",
  },
  centerButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Ajouter TouchableOpacity si ce n'est pas déjà importé
import { TouchableOpacity } from "react-native";
import { LocationMapProps } from "../types/geoloc.types";

