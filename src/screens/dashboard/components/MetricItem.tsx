// ✅ Composant MetricItem optimisé
// components/MetricItem.tsx
import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

interface MetricItemProps {
  value: number;
  unit: string;
  label: string;
  color?: string;
}

export const MetricItem = memo(
  ({ value, unit, label, color = COLORS.primary.main }: MetricItemProps) => (
    <View style={styles.container}>
      <View style={[styles.valueContainer, { backgroundColor: `${color}20` }]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.unit}>{unit}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  ),
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  valueContainer: {
    padding: 10,
    borderRadius: 16,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
  },
  unit: {
    fontSize: 12,
    color: COLORS.gray[400],
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
});
