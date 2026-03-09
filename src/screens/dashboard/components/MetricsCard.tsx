import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/color";
import { getFontFamily } from "./../../../constants/typography";

// ==================== PALETTE DE BLEUS ====================
const BLUE_PRO = {
  primary: "#0A4DA4",
  secondary: "#1E6EC7",
  light: "#E8F0FE",
  dark: "#07317A",
  textLight: "#FFFFFF",
  textBlue: "#1E3A5F", // Bleu profond élégant
  textMuted: "#5A6B7A", // Bleu-gris secondaire
} as const;

// ==================== TYPES ====================
interface MetricItemProps {
  value: number;
  unit: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  trend?: number;
  onPress?: () => void;
}

interface MetricsCardProps {
  retard: number;
  supplementaires: number;
  objectif?: number;
  objectifAtteint?: number;
  onMetricPress?: (metric: string) => void;
}

// ==================== COMPOSANT METRIC ITEM ====================
const MetricItem = memo(
  ({
    value,
    unit,
    label,
    icon,
    color = BLUE_PRO.primary,
    trend,
    onPress,
  }: MetricItemProps) => {
    // Animation de pulsation pour les valeurs importantes
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (trend && trend > 0) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }
    }, [trend]);

    const handlePress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    }, [onPress]);

    // Déterminer la couleur de la tendance
    const getTrendColor = () => {
      if (!trend) return COLORS.gray[400];
      return trend > 0 ? BLUE_PRO.primary : BLUE_PRO.secondary;
    };

    return (
      <Animated.View
        style={[styles.metricItem, { transform: [{ scale: pulseAnim }] }]}
      >
        <View style={styles.metricContent}>
          {/* Cercle de valeur avec gradient */}
          <LinearGradient
            colors={[`${color}15`, `${color}05`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.metricValueContainer]}
          >
            <Text style={[styles.metricValue, { color }]}>{value}</Text>
          </LinearGradient>

          {/* Unité */}
          <Text style={styles.metricUnit}>{unit}</Text>

          {/* Label avec icône optionnelle */}
          <View style={styles.metricLabelContainer}>
            {icon && (
              <Ionicons name={icon} size={14} color={COLORS.gray[500]} />
            )}
            <Text style={styles.metricLabel}>{label}</Text>
          </View>

          {/* Tendance (si présente) */}
          {trend !== undefined && (
            <View style={styles.trendContainer}>
              <Ionicons
                name={trend > 0 ? "arrow-up" : "arrow-down"}
                size={12}
                color={getTrendColor()}
              />
              <Text style={[styles.trendText, { color: getTrendColor() }]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>

        {/* Overlay tactile pour le clic */}
        {onPress && (
          <Animated.View style={styles.touchOverlay}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={handlePress}
              activeOpacity={0.7}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  },
);

// ==================== COMPOSANT PRINCIPAL ====================
export const MetricsCard = memo(
  ({
    retard,
    supplementaires,
    objectif = 35,
    objectifAtteint = 28,
    onMetricPress,
  }: MetricsCardProps) => {
    // Calcul du pourcentage d'objectif atteint
    const pourcentageObjectif = Math.min(
      Math.round((objectifAtteint / objectif) * 100),
      100,
    );

    // Animation de la barre de progression
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(progressAnim, {
        toValue: pourcentageObjectif / 100,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }).start();
    }, [pourcentageObjectif]);

    // Largeur animée de la barre de progression
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.container}>
        {/* Métriques principales */}
        <View style={styles.metricsRow}>
          <MetricItem
            value={retard}
            unit="min"
            label="Retard"
            icon="time-outline"
            color={COLORS.error.main}
            trend={retard > 0 ? -15 : undefined}
            onPress={() => onMetricPress?.("retard")}
          />

          <View style={styles.divider} />

          <MetricItem
            value={supplementaires}
            unit="h"
            label="Suppl."
            icon="trending-up-outline"
            color={BLUE_PRO.secondary}
            trend={supplementaires > 0 ? 20 : undefined}
            onPress={() => onMetricPress?.("supplementaires")}
          />

          <View style={styles.divider} />

          <MetricItem
            value={objectif}
            unit="h"
            label="Objectif"
            icon="flag-outline"
            color={BLUE_PRO.primary}
            onPress={() => onMetricPress?.("objectif")}
          />
        </View>

        {/* Barre de progression de l'objectif */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Objectif hebdomadaire</Text>
            <Text style={styles.progressValue}>
              {objectifAtteint}h / {objectif}h
            </Text>
          </View>

          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressWidth,
                  backgroundColor:
                    pourcentageObjectif >= 100
                      ? BLUE_PRO.primary
                      : pourcentageObjectif >= 75
                        ? BLUE_PRO.secondary
                        : BLUE_PRO.primary + "80",
                },
              ]}
            />
          </View>

          <Text style={styles.progressPercentage}>
            {pourcentageObjectif}% atteint
          </Text>
        </View>

        {/* Séparateur décoratif */}
        <View style={styles.decorativeLine}>
          <LinearGradient
            colors={[BLUE_PRO.light, BLUE_PRO.primary, BLUE_PRO.light]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.decorativeGradient}
          />
        </View>
      </View>
    );
  },
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  metricContent: {
    alignItems: "center",
  },
  metricValueContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  metricValue: {
    fontSize: 22,
    fontFamily: getFontFamily("bold"),
  },
  metricUnit: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  metricLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: getFontFamily("medium"),
    color: BLUE_PRO.textBlue, // Changé de COLORS.gray[600] à textBlue
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontFamily: getFontFamily("medium"),
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 8,
  },
  touchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  touchable: {
    flex: 1,
  },
  progressContainer: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[600],
  },
  progressValue: {
    fontSize: 13,
    fontFamily: getFontFamily("semibold"),
    color: BLUE_PRO.textBlue, // Changé de textDark à textBlue
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 11,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    textAlign: "right",
  },
  decorativeLine: {
    position: "absolute",
    bottom: -1,
    left: 20,
    right: 20,
    height: 2,
  },
  decorativeGradient: {
    flex: 1,
    height: "100%",
  },
});

// Ajout des display names
MetricItem.displayName = "MetricItem";
MetricsCard.displayName = "MetricsCard";
