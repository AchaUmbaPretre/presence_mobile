import React from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { COLORS } from "../../dashboard/constants/color";
import { getFontFamily } from "../../../constants/typography";
import { SettingsHeaderProps } from "../types/settings.types";

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ style }) => {
  return (
    <Animated.View style={[styles.header, style]}>
      <LinearGradient
        colors={[COLORS.primary.main, COLORS.primary.dark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Paramètres</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 60,
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
  },
});