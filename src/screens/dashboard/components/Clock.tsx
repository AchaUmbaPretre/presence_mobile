import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../constants/color";

interface ClockProps {
  time: string;
  seconds: string;
  date: string;
}

export const Clock = memo(({ time, seconds, date }: ClockProps) => (
  <>
    <View style={styles.dateChip}>
      <Icon
        name="calendar-blank-outline"
        size={14}
        color={COLORS.primary.main}
      />
      <Text style={styles.dateText}>{date}</Text>
    </View>

    <View style={styles.clockContainer}>
      <Text style={styles.clockTime}>{time}</Text>
      <Text style={styles.clockSeconds}>{seconds}</Text>
    </View>
  </>
));

const styles = StyleSheet.create({
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  dateText: {
    fontSize: 13,
    color: COLORS.gray[600],
    marginLeft: 6,
    textTransform: "capitalize",
  },
  clockContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 28,
  },
  clockTime: {
    fontSize: 48,
    fontWeight: "300",
    color: COLORS.gray[900],
    letterSpacing: -1,
  },
  clockSeconds: {
    fontSize: 20,
    color: COLORS.gray[400],
    marginLeft: 8,
    fontWeight: "300",
  },
});
