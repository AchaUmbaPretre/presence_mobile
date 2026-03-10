import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { LOCATION_MESSAGES, ZONE_COLORS } from "../constants/geoloc.constants";
import { LocationStatus } from "../types/geoloc.types";

interface LocationInfoProps {
  status: LocationStatus;
  isLoading: boolean;
}

export const LocationInfo: React.FC<LocationInfoProps> = ({
  status,
  isLoading,
}) => {
  const getStatusColor = () => {
    if (isLoading) return COLORS.gray[400];
    return status.isWithinZone ? ZONE_COLORS.authorized : ZONE_COLORS.forbidden;
  };

  const getStatusIcon = () => {
    if (isLoading) return "time-outline";
    return status.isWithinZone ? "checkmark-circle" : "alert-circle";
  };

  const getStatusMessage = () => {
    if (isLoading) return LOCATION_MESSAGES.loading;
    if (!status.isWithinZone) return LOCATION_MESSAGES.outsideZone;
    if (status.accuracy > 50) return LOCATION_MESSAGES.poorAccuracy;
    return LOCATION_MESSAGES.withinZone;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const content = (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: getStatusColor() + "15" },
        ]}
      >
        <Ionicons name={getStatusIcon()} size={28} color={getStatusColor()} />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.message, { color: getStatusColor() }]}>
          {getStatusMessage()}
        </Text>

        {!isLoading && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="resize" size={14} color={COLORS.gray[500]} />
              <Text style={styles.detailText}>
                Distance: {formatDistance(status.distance)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="speedometer" size={14} color={COLORS.gray[500]} />
              <Text style={styles.detailText}>
                Précision: ±{Math.round(status.accuracy)} m
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        {content}
      </BlurView>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.gray[50]]}
      style={styles.gradientContainer}
    >
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  gradientContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginBottom: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    fontFamily: getFontFamily("semibold"),
    marginBottom: 4,
  },
  details: {
    gap: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
  },
});
