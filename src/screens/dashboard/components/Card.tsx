import React, { memo } from "react";
import {
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
}

export const Card = memo(
  ({ children, style, onPress, disabled, active }: CardProps) => (
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
  ),
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  cardActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  cardDisabled: {
    opacity: 0.5,
  },
});
