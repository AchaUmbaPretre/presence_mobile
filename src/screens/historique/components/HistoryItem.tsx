import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { STATUS_CONFIG } from "../constants/history.constants";
import { HistoryItemProps, PresenceStatus } from "../types/history.types";

export const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onPress,
  showActions = true,
}) => {
  const statut = item.statut as PresenceStatus;

  const config = statut ? STATUS_CONFIG[statut] : undefined;

  if (!config) {
    console.warn(`Configuration manquante pour le statut: ${statut}`);
    return null;
  }

  const date = useMemo(
    () =>
      new Date(item.date).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    [item.date],
  );

  const formatTime = (time: string | null) => time || "--:--";

  const siteName = item.site || "Site inconnu";

  const formatHeuresSupp = (heures: number) => {
    if (heures === 0) return null;
    return heures % 1 === 0 ? `${heures}h` : `${heures}h`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[COLORS.white, COLORS.gray[50]]}
        style={styles.gradient}
      >
        <View style={styles.leftSection}>
          {/* Icône de statut */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.lightColor },
            ]}
          >
            <Ionicons name={config.icon} size={20} color={config.color} />
          </View>

          {/* Date et site */}
          <View style={styles.infoContainer}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.site} numberOfLines={1}>
              {siteName}
            </Text>
          </View>
        </View>

        {/* Badge de statut */}
        <View
          style={[styles.statusBadge, { backgroundColor: config.lightColor }]}
        >
          <View style={[styles.statusDot, { backgroundColor: config.color }]} />
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.badge}
          </Text>
        </View>

        {/* Heures */}
        <View style={styles.timeContainer}>
          <View style={styles.timeRow}>
            <Ionicons
              name="log-in-outline"
              size={14}
              color={COLORS.gray[500]}
            />
            <Text style={styles.timeText}>{formatTime(item.heure_entree)}</Text>
          </View>
          <View style={styles.timeRow}>
            <Ionicons
              name="log-out-outline"
              size={14}
              color={COLORS.gray[500]}
            />
            <Text style={styles.timeText}>{formatTime(item.heure_sortie)}</Text>
          </View>
        </View>

        {/* Métriques */}
        {(item.retard_minutes > 0 || item.heures_supplementaires > 0) && (
          <View style={styles.metricsContainer}>
            {item.retard_minutes > 0 && (
              <View style={styles.metric}>
                <Text
                  style={[styles.metricValue, { color: COLORS.warning.main }]}
                >
                  +{item.retard_minutes}'
                </Text>
              </View>
            )}
            {item.heures_supplementaires > 0 && (
              <View style={styles.metric}>
                <Text
                  style={[styles.metricValue, { color: COLORS.success.main }]}
                >
                  +{formatHeuresSupp(item.heures_supplementaires)}
                </Text>
              </View>
            )}
          </View>
        )}

        {showActions && (
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
    textTransform: "capitalize",
    marginBottom: 2,
  },
  site: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: getFontFamily("medium"),
  },
  timeContainer: {
    gap: 2,
    minWidth: 70,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[700],
  },
  metricsContainer: {
    alignItems: "flex-end",
    minWidth: 60,
  },
  metric: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: COLORS.gray[100],
    marginVertical: 1,
  },
  metricValue: {
    fontSize: 11,
    fontFamily: getFontFamily("bold"),
  },
});
