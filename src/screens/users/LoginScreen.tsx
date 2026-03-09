import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Images } from "./../../../assets/index";
import { getFontFamily } from "./../../constants/typography";
import { COLORS } from "./../dashboard/constants/color";
import { AuthInput } from "./components/AuthInput";
import { LoginButton } from "./components/LoginButton";
import { PasswordInput } from "./components/PasswordInput";
import { AUTH_MESSAGES } from "./constants/auth.constants";
import { useLoginForm } from "./hooks/useLoginForm";

const { width, height } = Dimensions.get("window");

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
    handleFocus,
    handleBlur,
    goToSignup,
    goToForgotPassword,
  } = useLoginForm();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

        {/* Fond avec dégradé */}
        <LinearGradient
          colors={[COLORS.background, COLORS.white]}
          style={StyleSheet.absoluteFill}
        />

        {/* Effet de flou en arrière-plan (iOS uniquement) */}
        {Platform.OS === "ios" && (
          <BlurView
            intensity={15}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        )}

        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header avec animation */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={Images.loginIcon}
                style={styles.logo}
                resizeMode="contain"
              />

              <View style={styles.logoBadge}>
                <LinearGradient
                  colors={[COLORS.success.main, COLORS.success.dark]}
                  style={styles.logoBadgeGradient}
                >
                  <Ionicons name="checkmark" size={12} color={COLORS.white} />
                </LinearGradient>
              </View>
            </View>

            <Text style={styles.title}>Bienvenue 👋</Text>
            <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formWrapper,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.formCard}>
              <AuthInput
                label={AUTH_MESSAGES.LABELS.EMAIL}
                value={formData.email}
                onChangeText={(text) => {
                  Haptics.selectionAsync();
                  updateField("email", text);
                }}
                placeholder={AUTH_MESSAGES.PLACEHOLDERS.EMAIL}
                icon="mail-outline"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                isFocused={focusedInput === "email"}
                onFocus={() => handleFocus("email")}
                onBlur={handleBlur}
                returnKeyType="next"
                onSubmitEditing={() => handleFocus("password")}
              />

              <PasswordInput
                value={formData.password}
                onChangeText={(text) => {
                  Haptics.selectionAsync();
                  updateField("password", text);
                }}
                error={errors.password}
                isFocused={focusedInput === "password"}
                onFocus={() => handleFocus("password")}
                onBlur={handleBlur}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                style={styles.forgotPasswordContainer}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  goToForgotPassword();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotPasswordText}>
                  {AUTH_MESSAGES.LABELS.FORGOT_PASSWORD}
                </Text>
              </TouchableOpacity>

              <LoginButton
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleLogin();
                }}
                loading={loading}
                disabled={!isFormValid}
              />
            </View>
          </Animated.View>

          {/* Version de l'app */}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary.main,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  logoGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  logo: {
    width: 80,
    height: 80,
    // ✅ SUPPRIMER tintColor pour garder les couleurs originales
    // tintColor: COLORS.white,  // ← LIGNE SUPPRIMÉE
  },
  logoBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  logoBadgeGradient: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.gray[900],
    fontFamily: getFontFamily("bold"),
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray[500],
    fontFamily: getFontFamily("regular"),
    textAlign: "center",
    lineHeight: 22,
  },
  formWrapper: {
    width: "100%",
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary.main,
    fontFamily: getFontFamily("medium"),
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  signupText: {
    fontSize: 15,
    color: COLORS.gray[500],
    fontFamily: getFontFamily("regular"),
  },
  signupLinkGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 6,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: getFontFamily("semibold"),
  },
  version: {
    fontSize: 11,
    color: COLORS.gray[400],
    fontFamily: getFontFamily("regular"),
    textAlign: "center",
    marginTop: 15,
  },
});

export default LoginScreen;
