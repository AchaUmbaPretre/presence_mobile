import { COLORS } from "./../dashboard/constants/color";
import { TYPOGRAPHY, getFontFamily } from "./../../constants/typography";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
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
    isFormValid,
    updateField,
    handleLogin,
    togglePasswordVisibility,
    handleFocus,  // ← CORRIGÉ: setFocus -> handleFocus
    handleBlur,   // ← AJOUTÉ: récupérer handleBlur
    goToSignup,
    goToForgotPassword,
  } = useLoginForm();

  // Fonction pour dismiss le clavier
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={COLORS.background} 
          translucent={false}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
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
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              isFocused={focusedInput === "email"}
              onFocus={() => handleFocus("email")}        // ← CORRIGÉ
              onBlur={handleBlur}                          // ← CORRIGÉ
              returnKeyType="next"
              onSubmitEditing={() => handleFocus("password")} // ← CORRIGÉ
            />

            <PasswordInput
              value={formData.password}
              onChangeText={(text) => updateField("password", text)}
              error={errors.password}
              isFocused={focusedInput === "password"}
              onFocus={() => handleFocus("password")}      // ← CORRIGÉ
              onBlur={handleBlur}                           // ← CORRIGÉ
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={goToForgotPassword}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>
                {AUTH_MESSAGES.LABELS.FORGOT_PASSWORD}
              </Text>
            </TouchableOpacity>

            <LoginButton
              onPress={handleLogin}
              loading={loading}
              disabled={!isFormValid}
            />

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                {AUTH_MESSAGES.LABELS.NO_ACCOUNT}
              </Text>
              <TouchableOpacity 
                onPress={goToSignup}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.signupLink}>
                  {AUTH_MESSAGES.LABELS.SIGNUP}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Version de l'app (optionnel) */}
          <Text style={styles.version}>Version 1.0.0</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    paddingBottom: 20,
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
    fontFamily: getFontFamily('bold'),
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray[500],
    fontFamily: getFontFamily('regular'),
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
    fontFamily: getFontFamily('medium'),
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 15,
    color: COLORS.gray[500],
    fontFamily: getFontFamily('regular'),
  },
  signupLink: {
    fontSize: 15,
    color: COLORS.primary.main,
    fontFamily: getFontFamily('semibold'),
    marginLeft: 4,
  },
  version: {
    fontSize: 12,
    color: COLORS.gray[400],
    fontFamily: getFontFamily('regular'),
    textAlign: "center",
    marginTop: 20,
  },
});

export default LoginScreen;