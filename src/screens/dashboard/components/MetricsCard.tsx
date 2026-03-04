import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/color";

interface MetricItemProps {
  value: number;
  unit: string;
  label: string;
  color?: string;
}

const MetricItem = memo(
  ({ value, unit, label, color = COLORS.primary.main }: MetricItemProps) => (
    <View style={styles.metricItem}>
      <View
        style={[styles.metricValueContainer, { backgroundColor: `${color}20` }]}
      >
        <Text style={[styles.metricValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.metricUnit}>{unit}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  ),
);

interface MetricsCardProps {
  retard: number;
  supplementaires: number;
  objectif?: number;
}

export const MetricsCard = memo(
  ({ retard, supplementaires, objectif = 35 }: MetricsCardProps) => (
    <View style={styles.container}>
      <MetricItem
        value={retard}
        unit="min"
        label="Retard"
        color={COLORS.error.main}
      />
      <View style={styles.divider} />
      <MetricItem
        value={supplementaires}
        unit="h"
        label="Suppl."
        color={COLORS.success.main}
      />
      <View style={styles.divider} />
      <MetricItem
        value={objectif}
        unit="h"
        label="Objectif"
        color={COLORS.primary.main}
      />
    </View>
  ),
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#ffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValueContainer: {
    padding: 10,
    borderRadius: 16,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "600",
  },
  metricUnit: {
    fontSize: 12,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 12,
  },
});
