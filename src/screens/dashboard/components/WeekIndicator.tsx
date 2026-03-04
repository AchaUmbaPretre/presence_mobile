import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
    FadeInDown,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants/color";
import { WeekDay } from "../types/presence.types";
import { getFontFamily } from "./../../../constants/typography";

// ==================== TYPES ====================
interface WeekIndicatorProps {
  days: WeekDay[];
  onDayPress?: (day: WeekDay, index: number) => void;
  showHours?: boolean;
}

// ==================== COMPOSANT PRINCIPAL ====================
export const WeekIndicator = memo(
  ({ days, onDayPress, showHours = false }: WeekIndicatorProps) => {
    // Rendu d'un jour avec animation
    const renderDay = useCallback(
      (day: WeekDay, index: number) => {
        const scale = useSharedValue(1);
        const glow = useSharedValue(0);

        // Déterminer le statut du jour
        const getDayStatus = () => {
          if (day.present && day.partial) return "partial";
          if (day.present) return "present";
          return "absent";
        };

        const status = getDayStatus();

        // Configuration selon le statut avec `as const` pour les gradients
        const getStatusConfig = () => {
          switch (status) {
            case "present":
              return {
                color: COLORS.success.main,
                gradient: [COLORS.success.light, COLORS.success.main] as const,
                icon: "checkmark-circle" as const,
                label: "Présent",
              };
            case "partial":
              return {
                color: COLORS.warning.main,
                gradient: [COLORS.warning.light, COLORS.warning.main] as const,
                icon: "time" as const,
                label: "Partiel",
              };
            default:
              return {
                color: COLORS.gray[300],
                gradient: [COLORS.gray[200], COLORS.gray[300]] as const,
                icon: "close-circle" as const,
                label: "Absent",
              };
          }
        };

        const config = getStatusConfig();

        // Gestion du clic
        const handlePress = () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          scale.value = withSpring(0.9, { damping: 10 }, () => {
            scale.value = withSpring(1);
          });

          glow.value = withTiming(1, { duration: 150 }, () => {
            glow.value = withTiming(0, { duration: 200 });
          });

          onDayPress?.(day, index);
        };

        // Styles animés
        const animatedStyle = useAnimatedStyle(() => ({
          transform: [{ scale: scale.value }],
        }));

        const glowStyle = useAnimatedStyle(() => ({
          opacity: interpolate(glow.value, [0, 1], [0, 0.3]),
        }));

        return (
          <Animated.View
            key={index}
            entering={FadeInDown.delay(100 + index * 50).springify()}
            style={[styles.weekDayWrapper, animatedStyle]}
          >
            <Animated.View style={[styles.glowEffect, glowStyle]} />

            <View style={styles.weekDayContent}>
              {/* Lettre du jour */}
              <Text style={styles.weekDayLetter}>{day.letter}</Text>

              {/* Indicateur avec gradient */}
              <LinearGradient
                colors={config.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.weekDayIndicator,
                  { opacity: status !== "absent" ? 1 : 0.3 },
                ]}
              >
                {status !== "absent" && (
                  <Ionicons name={config.icon} size={10} color={COLORS.white} />
                )}
              </LinearGradient>

              {/* Heures (optionnel) */}
              {showHours && day.heures && (
                <Text style={styles.weekDayHours}>{day.heures}h</Text>
              )}
            </View>

            {/* Label du statut au survol (pour les grands écrans) */}
            {Platform.OS === "web" && (
              <View
                style={[
                  styles.statusTooltip,
                  { backgroundColor: config.color },
                ]}
              >
                <Text style={styles.statusTooltipText}>{config.label}</Text>
              </View>
            )}
          </Animated.View>
        );
      },
      [onDayPress, showHours],
    );

    // Calcul des statistiques de la semaine
    const stats = {
      present: days.filter((d) => d.present && !d.partial).length,
      partial: days.filter((d) => d.partial).length,
      total: days.length,
    };

    return (
      <View style={styles.section}>
        {/* En-tête avec statistiques */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cette semaine</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statDot,
                  { backgroundColor: COLORS.success.main },
                ]}
              />
              <Text style={styles.statText}>{stats.present}</Text>
            </View>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statDot,
                  { backgroundColor: COLORS.warning.main },
                ]}
              />
              <Text style={styles.statText}>{stats.partial}</Text>
            </View>
          </View>
        </View>

        {/* Conteneur de la semaine */}
        <LinearGradient
          colors={[COLORS.white, COLORS.gray[50]] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weekContainer}
        >
          {/* Grille des jours */}
          <View style={styles.weekGrid}>
            {days.map((day, index) => renderDay(day, index))}
          </View>

          {/* Ligne décorative */}
          <View style={styles.decorativeLine}>
            <LinearGradient
              colors={[
                COLORS.primary.light,
                COLORS.primary.main,
                COLORS.primary.light,
              ] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.decorativeGradient}
            />
          </View>
        </LinearGradient>
      </View>
    );
  },
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[600],
  },
  weekContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  weekGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  weekDayWrapper: {
    alignItems: "center",
    position: "relative",
    padding: 8,
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary.main,
    opacity: 0,
    borderRadius: 12,
  },
  weekDayContent: {
    alignItems: "center",
    gap: 8,
  },
  weekDayLetter: {
    fontSize: 15,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[700],
    marginBottom: 4,
  },
  weekDayIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  weekDayHours: {
    fontSize: 11,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[500],
    marginTop: 4,
  },
  statusTooltip: {
    position: "absolute",
    top: -30,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    opacity: 0,
    ...Platform.select({
      web: {
        transition: "opacity 0.2s",
        ":hover": {
          opacity: 1,
        },
      },
    }),
  },
  statusTooltipText: {
    color: COLORS.white,
    fontSize: 10,
    fontFamily: getFontFamily("medium"),
  },
  decorativeLine: {
    height: 2,
    width: "80%",
    alignSelf: "center",
    marginBottom: 8,
  },
  decorativeGradient: {
    flex: 1,
    height: "100%",
  },
});

// Ajout du display name
WeekIndicator.displayName = "WeekIndicator";