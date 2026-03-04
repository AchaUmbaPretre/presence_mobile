import { COLORS } from "./../dashboard/constants/color";
import { TYPOGRAPHY } from "./../../constants/typography";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthInput } from "./components/AuthInput";
import { LoginButton } from "./components/LoginButton";
import { PasswordInput } from "./components/PasswordInput";
import { AUTH_MESSAGES } from "./constants/auth.constants";
import { useLoginForm } from "./hooks/useLoginForm";

const LoginScreen = () => {
  const {
    formData,
    errors,
    loading,
    showPassword,
    focusedInput,
    updateField,
    handleLogin,
    togglePasswordVisibility,
    setFocus,
  } = useLoginForm();

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="lock-closed"
                size={40}
                color={COLORS.primary.main}
              />
            </View>
          </View>
          <Text style={styles.title}>Bienvenue 👋</Text>
          <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <AuthInput
            label={AUTH_MESSAGES.LABELS.EMAIL}
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
            placeholder={AUTH_MESSAGES.PLACEHOLDERS.EMAIL}
            icon="mail-outline"
            error={errors.email}
            keyboardType="email-address"
            isFocused={focusedInput === "email"}
            onFocus={() => setFocus("email")}
            onBlur={() => setFocus(null)}
          />

          <PasswordInput
            value={formData.password}
            onChangeText={(text) => updateField("password", text)}
            error={errors.password}
            isFocused={focusedInput === "password"}
            onFocus={() => setFocus("password")}
            onBlur={() => setFocus(null)}
          />

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>
              {AUTH_MESSAGES.LABELS.FORGOT_PASSWORD}
            </Text>
          </TouchableOpacity>

          <LoginButton
            onPress={handleLogin}
            loading={loading}
            disabled={!formData.email || !formData.password}
          />

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              {AUTH_MESSAGES.LABELS.NO_ACCOUNT}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.signupLink}>
                {AUTH_MESSAGES.LABELS.SIGNUP}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary.light,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary.light,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.gray[900],
    fontFamily: TYPOGRAPHY.fonts.bold,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    fontFamily: TYPOGRAPHY.fonts.regular,
    textAlign: "center",
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 40,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: COLORS.primary.main,
    fontFamily: TYPOGRAPHY.fonts.medium,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 15,
    color: COLORS.gray[500],
    fontFamily: TYPOGRAPHY.fonts.regular,
  },
  signupLink: {
    fontSize: 15,
    color: COLORS.primary.main,
    fontFamily: TYPOGRAPHY.fonts.semibold,
  },
});

export default LoginScreen;
