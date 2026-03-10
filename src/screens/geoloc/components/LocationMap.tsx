import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ZONE_COLORS } from "../constants/geoloc.constants";
import { Coordinates } from "../types/geoloc.types";

const { width, height } = Dimensions.get("window");

interface LocationMapProps {
  siteCoordinates: Coordinates;
  userLocation?: Coordinates;
  radius: number;
  isWithinZone?: boolean;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  siteCoordinates,
  userLocation,
  radius,
  isWithinZone,
}) => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    }
  }, [userLocation]);

  const getZoneColor = () => {
    if (isWithinZone === undefined) return ZONE_COLORS.neutral;
    return isWithinZone ? ZONE_COLORS.authorized : ZONE_COLORS.forbidden;
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...siteCoordinates,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton
        showsCompass
      >
        {/* Zone autorisée */}
        <Circle
          center={siteCoordinates}
          radius={radius}
          fillColor={getZoneColor() + "20"}
          strokeColor={getZoneColor()}
          strokeWidth={2}
        />

        {/* Marqueur du site */}
        <Marker coordinate={siteCoordinates}>
          <View style={styles.siteMarker}>
            <Ionicons name="business" size={24} color={COLORS.white} />
          </View>
        </Marker>

        {/* Marqueur utilisateur (si disponible) */}
        {userLocation && (
          <Marker coordinate={userLocation}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  siteMarker: {
    backgroundColor: COLORS.primary.main,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userMarkerSafe: {
    backgroundColor: COLORS.success.main,
  },
  userMarkerWarning: {
    backgroundColor: COLORS.error.main,
  },
});
