import { COLORS } from "./../../dashboard/constants/color";
import { TYPOGRAPHY } from "./../../../constants/typography";
import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface LoginButtonProps {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
}

export const LoginButton = memo(
  ({ onPress, loading, disabled }: LoginButtonProps) => (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <View style={styles.buttonContent}>
          <Text style={styles.buttonText}>Se connecter</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary.main,
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: COLORS.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primary.light,
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "600",
    fontFamily: TYPOGRAPHY.fonts.semibold,
    marginRight: 8,
  },
});
