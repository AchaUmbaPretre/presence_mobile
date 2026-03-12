import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useMemo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../constants/color";
import { WeekDay } from "../types/weekIndication.type";

interface WeekIndicatorProps {
  days: WeekDay[];
  onDayPress?: (day: WeekDay, index: number) => void;
  showHours?: boolean;
}

type Status = "present" | "partial" | "absent";

const STATUS_CONFIG = {
  present: {
    color: COLORS.success.main,
    gradient: [COLORS.success.light, COLORS.success.main] as const,
    icon: "checkmark-circle",
    label: "Présent",
  },
  partial: {
    color: COLORS.warning.main,
    gradient: [COLORS.warning.light, COLORS.warning.main] as const,
    icon: "time",
    label: "Partiel",
  },
  absent: {
    color: COLORS.gray[300],
    gradient: [COLORS.gray[200], COLORS.gray[300]] as const,
    icon: "close-circle",
    label: "Absent",
  },
};

const getDayStatus = (day: WeekDay): Status => {
  if (day.present && day.partial) return "partial";
  if (day.present) return "present";
  return "absent";
};

const DayItem = memo(
  ({
    day,
    index,
    onPress,
    showHours,
  }: {
    key: number;
    day: WeekDay;
    index: number;
    onPress?: (day: WeekDay, index: number) => void;
    showHours: boolean;
  }) => {
    const scale = useSharedValue(1);
    const glow = useSharedValue(0);

    const status = getDayStatus(day);
    const config = STATUS_CONFIG[status];

    const handlePress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      scale.value = withSpring(0.92, { damping: 12 }, () => {
        scale.value = withSpring(1);
      });

      glow.value = withTiming(1, { duration: 120 }, () => {
        glow.value = withTiming(0, { duration: 180 });
      });

      onPress?.(day, index);
    }, [day, index, onPress]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
      opacity: interpolate(glow.value, [0, 1], [0, 0.25]),
    }));

    return (
      <Animated.View
        entering={FadeInDown.delay(80 + index * 40).springify()}
        style={[styles.weekDayWrapper, animatedStyle]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.75}>
          <Animated.View
            style={[
              styles.glowEffect,
              { backgroundColor: config.color },
              glowStyle,
            ]}
          />

          <View style={styles.weekDayContent}>
            <Text style={styles.weekDayLetter}>{day.letter}</Text>

            <LinearGradient
              colors={config.gradient}
              style={[
                styles.weekDayIndicator,
                { opacity: status !== "absent" ? 1 : 0.35 },
              ]}
            >
              {status !== "absent" && (
                <Ionicons
                  name={config.icon as any}
                  size={10}
                  color={COLORS.white}
                />
              )}
            </LinearGradient>

            {showHours && day.heures !== undefined && (
              <Text style={styles.weekDayHours}>{day.heures}h</Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

DayItem.displayName = "DayItem";

export const WeekIndicator = memo(
  ({ days, onDayPress, showHours = false }: WeekIndicatorProps) => {
    const stats = useMemo(() => {
      let present = 0;
      let partial = 0;

      for (const d of days) {
        if (d.partial) partial++;
        else if (d.present) present++;
      }

      return { present, partial };
    }, [days]);

    const handlePress = useCallback(
      (day: WeekDay, index: number) => {
        onDayPress?.(day, index);
      },
      [onDayPress],
    );

    return (
      <View style={styles.section}>
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

        <LinearGradient
          colors={[COLORS.white, COLORS.gray[50]]}
          style={styles.weekContainer}
        >
          <View style={styles.weekGrid}>
            {days.map((day, index) => (
              <DayItem
                key={index}
                day={day}
                index={index}
                onPress={handlePress}
                showHours={showHours}
              />
            ))}
          </View>

          <View style={styles.decorativeLine}>
            <LinearGradient
              colors={[
                COLORS.primary.light,
                COLORS.primary.main,
                COLORS.primary.light,
              ]}
              style={styles.decorativeGradient}
            />
          </View>
        </LinearGradient>
      </View>
    );
  },
);

WeekIndicator.displayName = "WeekIndicator";

const styles = StyleSheet.create({
  section: { marginBottom: 90 },
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
  statsContainer: { flexDirection: "row", gap: 12 },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statDot: { width: 8, height: 8, borderRadius: 4 },
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
      android: { elevation: 2 },
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
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    borderRadius: 12,
  },
  weekDayContent: { alignItems: "center", gap: 8 },
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
      android: { elevation: 2 },
    }),
  },
  weekDayHours: {
    fontSize: 11,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[500],
    marginTop: 4,
  },
  decorativeLine: {
    height: 2,
    width: "80%",
    alignSelf: "center",
    marginBottom: 8,
  },
  decorativeGradient: { flex: 1, height: "100%" },
});

DayItem.displayName = "DayItem";
WeekIndicator.displayName = "WeekIndicator";
