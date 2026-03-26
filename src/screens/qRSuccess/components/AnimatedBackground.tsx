// screens/qr-success/components/AnimatedBackground.tsx
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, StyleSheet } from "react-native";

interface AnimatedBackgroundProps {
  gradientColors: [string, string, string]; // ✅ Tuple explicite
  backgroundShift: Animated.AnimatedInterpolation<string>;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  gradientColors,
  backgroundShift,
}) => {
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ rotate: backgroundShift }] },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};
