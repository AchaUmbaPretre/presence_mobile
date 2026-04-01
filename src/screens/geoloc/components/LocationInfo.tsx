import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LOCATION_MESSAGES, ZONE_COLORS } from "../constants/geoloc.constants";
import { LocationInfoProps } from "../types/geoloc.types";

const AccuracyIndicator: React.FC<{ accuracy: number; color: string }> = ({
  accuracy,
  color,
}) => {
  const getAccuracyLevel = () => {
    if (accuracy < 10) return { label: "Haute", value: 90 };
    if (accuracy < 30) return { label: "Bonne", value: 70 };
    if (accuracy < 50) return { label: "Moyenne", value: 50 };
    return { label: "Faible", value: 30 };
  };

  const level = getAccuracyLevel();

  return (
    <View style={styles.accuracyContainer}>
      <View style={styles.accuracyHeader}>
        <Text style={styles.accuracyLabel}>Précision</Text>
        <Text style={[styles.accuracyLevel, { color }]}>{level.label}</Text>
      </View>
      <View style={styles.accuracyBar}>
        <View
          style={[
            styles.accuracyFill,
            { width: `${level.value}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
};

export const LocationInfo: React.FC<LocationInfoProps> = ({
  status,
  isLoading,
}) => {
  const statusColor = useMemo(() => {
    if (isLoading) return COLORS.gray[400];
    return status.isWithinZone ? ZONE_COLORS.authorized : ZONE_COLORS.forbidden;
  }, [isLoading, status.isWithinZone]);

  const statusIcon = useMemo(() => {
    if (isLoading) return "time-outline";
    return status.isWithinZone ? "checkmark-circle" : "alert-circle";
  }, [isLoading, status.isWithinZone]);

  const statusMessage = useMemo(() => {
    if (isLoading) return LOCATION_MESSAGES.loading;
    if (!status.isWithinZone) return LOCATION_MESSAGES.outsideZone;
    if (status.accuracy > 50) return LOCATION_MESSAGES.poorAccuracy;
    return LOCATION_MESSAGES.withinZone;
  }, [isLoading, status.isWithinZone, status.accuracy]);

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const containerStyle = Platform.select({
    ios: [styles.baseContainer, styles.iosContainer],
    android: [styles.baseContainer, styles.androidContainer],
  });
                  
  const content = (
    <Animated.View
      entering={FadeInDown.delay(100).springify()}
      style={styles.content}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={[`${statusColor}15`, `${statusColor}05`]}
          style={[styles.iconContainer, { borderColor: statusColor }]}
        >
          <Ionicons name={statusIcon} size={32} color={statusColor} />
        </LinearGradient>

        <View style={styles.headerText}>
          <Text style={[styles.title, { color: statusColor }]}>
            {status.isWithinZone ? "Zone Autorisée" : "Hors Zone"}
          </Text>
          <Text style={styles.message}>{statusMessage}</Text>
        </View>
      </View>

      {!isLoading && (
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons
                name="navigate-outline"
                size={16}
                color={COLORS.gray[500]}
              />
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={[styles.detailValue, { color: statusColor }]}>
                {formatDistance(status.distance)}
              </Text>
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailItem}>
              <Ionicons
                name="speedometer-outline"
                size={16}
                color={COLORS.gray[500]}
              />
              <Text style={styles.detailLabel}>Précision</Text>
              <Text style={[styles.detailValue, { color: statusColor }]}>
                ±{Math.round(status.accuracy)}m
              </Text>
            </View>
          </View>

          <AccuracyIndicator accuracy={status.accuracy} color={statusColor} />

          <View style={styles.timestamp}>
            <Ionicons name="time-outline" size={12} color={COLORS.gray[400]} />
            <Text style={styles.timestampText}>
              Mis à jour à{" "}
              {new Date(status.timestamp).toLocaleTimeString("fr-FR")}
            </Text>
          </View>
        </View>
      )}

      {/* Loader */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(200 + i * 100).springify()}
                style={[styles.loadingDot, { backgroundColor: statusColor }]}
              />
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={80} tint="light" style={containerStyle}>
        {content}
      </BlurView>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.gray[50]]}
      style={containerStyle}
    >
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    marginVertical: 8,
  },

  iosContainer: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },

  androidContainer: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    elevation: 4,
  },

  content: {},
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: COLORS.success.main,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: getFontFamily("bold"),
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
  },
  detailsCard: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginTop: 4,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: getFontFamily("bold"),
  },
  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 12,
  },
  accuracyContainer: {
    marginTop: 8,
  },
  accuracyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  accuracyLabel: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
  },
  accuracyLevel: {
    fontSize: 12,
    fontFamily: getFontFamily("semibold"),
  },
  accuracyBar: {
    height: 6,
    backgroundColor: COLORS.gray[300],
    borderRadius: 3,
    overflow: "hidden",
  },
  accuracyFill: {
    height: "100%",
    borderRadius: 3,
  },
  timestamp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 4,
  },
  timestampText: {
    fontSize: 11,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[400],
    fontStyle: "italic",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
});
