import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../constants/color";
import { ACTIONS_RAPIDES, LAYOUT } from "../constants/dashboard.constants";
import { IconWithBackground } from "./IconWithBackground";

interface QuickActionsProps {
  onActionPress?: (actionLabel: string) => void;
}

export const QuickActions = memo(({ onActionPress }: QuickActionsProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Actions rapides</Text>
    <View style={styles.actionsGrid}>
      {ACTIONS_RAPIDES.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionItem}
          onPress={() => onActionPress?.(action.label)}
        >
          <IconWithBackground
            name={action.icon}
            color={action.color}
            backgroundColor={`${action.color}20`}
            size={18}
          />
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
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
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionItem: {
    width: LAYOUT.actionItemWidth,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    boxShadow: "0px 0px 15px -10px rgba(0, 0, 0, 0.75)",
  },
  actionLabel: {
    fontSize: 13,
    color: COLORS.gray[700],
    marginLeft: 10,
  },
});
