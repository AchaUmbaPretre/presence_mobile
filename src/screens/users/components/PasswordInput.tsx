import { COLORS } from "./../../dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AuthInput } from "./AuthInput";

interface PasswordInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const PasswordInput = memo(
  ({
    value,
    onChangeText,
    error,
    isFocused,
    onFocus,
    onBlur,
  }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View style={styles.container}>
        <AuthInput
          label="Mot de passe"
          value={value}
          onChangeText={onChangeText}
          placeholder="Votre mot de passe"
          icon="lock-closed-outline"
          secureTextEntry={!showPassword}
          error={error}
          isFocused={isFocused}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={COLORS.gray[500]}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    bottom: 16,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
