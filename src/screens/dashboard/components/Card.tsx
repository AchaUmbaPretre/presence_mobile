import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import {
    Platform,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { COLORS } from "../constants/color";

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  active?: boolean;
  gradient?: boolean;
}

export const Card = memo(
  ({
    children,
    style,
    onPress,
    disabled,
    active,
    gradient = false,
  }: CardProps) => {
    const cardContent = gradient ? (
      <LinearGradient
        colors={[COLORS.white, COLORS.gray[50]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, active && styles.cardActive, style]}
      >
        {children}
      </LinearGradient>
    ) : (
      <TouchableOpacity
        style={[
          styles.card,
          active && styles.cardActive,
          disabled && styles.cardDisabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );

    return cardContent;
  },
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary.main,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardDisabled: {
    opacity: 0.5,
  },
});

// Ajout du display name
Card.displayName = "Card";
