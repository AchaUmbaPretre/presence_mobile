import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { COLORS } from "../constants/color";

interface IconWithBackgroundProps {
  name: string;
  color: string;
  backgroundColor: string;
  size?: number;
  gradient?: boolean;
}

export const IconWithBackground = memo(
  ({
    name,
    color,
    backgroundColor,
    size = 22,
    gradient = false,
  }: IconWithBackgroundProps) => {
    const iconName = name as keyof typeof Ionicons.glyphMap;

    const IconComponent = () => (
      <Ionicons name={iconName} size={size} color={color} style={styles.icon} />
    );

    if (gradient) {
      return (
        <LinearGradient
          colors={[backgroundColor, `${color}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.container, { backgroundColor }]}
        >
          <IconComponent />
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <IconComponent />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  icon: {
    textAlign: "center",
    textAlignVertical: "center",
  },
});

IconWithBackground.displayName = "IconWithBackground";
