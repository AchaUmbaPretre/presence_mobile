import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/color";
import { WeekDay } from "../types/presence.types";

interface WeekIndicatorProps {
  days: WeekDay[];
}

export const WeekIndicator = memo(({ days }: WeekIndicatorProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Cette semaine</Text>
    <View style={styles.weekContainer}>
      {days.map((day, index) => (
        <View key={index} style={styles.weekDay}>
          <Text style={styles.weekDayLetter}>{day.letter}</Text>
          <View
            style={[
              styles.weekDayIndicator,
              day.present && styles.weekDayPresent,
              day.partial && styles.weekDayPartial,
            ]}
          />
        </View>
      ))}
    </View>
  </View>
));

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.gray[900],
    letterSpacing: -0.2,
    marginBottom: 16,
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  weekDay: {
    alignItems: "center",
  },
  weekDayLetter: {
    fontSize: 13,
    color: COLORS.gray[500],
    marginBottom: 8,
    fontWeight: "500",
  },
  weekDayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray[200],
  },
  weekDayPresent: {
    backgroundColor: COLORS.success.main,
  },
  weekDayPartial: {
    backgroundColor: COLORS.warning.main,
  },
});
