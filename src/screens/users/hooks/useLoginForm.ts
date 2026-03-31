import { loginSuccess } from "@/store/authSlice";
import { handleApiError } from "@/utils/errorHandler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { ALERT_MESSAGES, AUTH_MESSAGES } from "../constants/auth.constants";
import { validateField, validateLoginForm } from "../schemas/validation.schema";
import { authService } from "../services/authService";
import {
  LoginFormData,
  RootStackParamList,
  ValidationErrors,
} from "../types/auth.types";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type FormField = keyof LoginFormData;

const INITIAL_FORM_DATA: LoginFormData = {
  email: "",
  password: "",
};

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<FormField | null>(null);

  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const isFormValid = useMemo(
    () => formData.email.trim() !== "" && formData.password.trim() !== "",
    [formData.email, formData.password],
  );

  const firstError = useMemo(() => Object.values(errors)[0], [errors]);

  // Mise à jour d'un champ avec validation en temps réel
  const updateField = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validation en temps réel (optionnelle)
    const fieldError = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldError || undefined,
    }));
  }, []);

  // Validation complète du formulaire
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setFocusedInput(null);
  }, []);

  // Gestion de la connexion
  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert(
        ALERT_MESSAGES.VALIDATION_ERROR,
        firstError || "Veuillez vérifier vos champs",
        [{ text: ALERT_MESSAGES.OK }],
      );

      // Focus sur le premier champ en erreur
      if (errors.email) {
        handleFocus("email");
      } else if (errors.password) {
        handleFocus("password");
      }

      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        username: formData.email.trim(),
        password: formData.password.trim(),
      });

      const { accessToken, user } = response;

      if (!accessToken) {
        throw new Error(AUTH_MESSAGES.ERROR.TOKEN_MISSING);
      }

      dispatch(loginSuccess({ token: accessToken, user }));
      resetForm();

      // ✅ Plus besoin de navigation.reset
      // Le RootNavigator basculera automatiquement grâce à Redux
    } catch (error: any) {
      const errorMessage = handleApiError(error);

      // Messages d'erreur personnalisés selon le code HTTP
      if (error.response?.status === 401) {
        Alert.alert(
          "Authentification échouée",
          "Email ou mot de passe incorrect",
        );
      } else if (error.response?.status === 404) {
        Alert.alert("Compte introuvable", "Aucun compte associé à cet email");
      } else {
        Alert.alert(ALERT_MESSAGES.LOGIN_FAILED, errorMessage, [
          { text: ALERT_MESSAGES.RETRY, style: "default" },
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, firstError, errors, resetForm, dispatch]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleFocus = useCallback((field: FormField) => {
    setFocusedInput(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

  const goToSignup = useCallback(() => {
    navigation.navigate("Signup");
  }, [navigation]);

  const goToForgotPassword = useCallback(() => {
    navigation.navigate("ForgotPassword");
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    // État
    formData,
    errors,
    loading,
    showPassword,
    focusedInput,
    isFormValid,
    firstError,

    // Actions
    updateField,
    handleLogin,
    togglePasswordVisibility,
    handleFocus,
    handleBlur,
    resetForm,

    // Navigation
    goToSignup,
    goToForgotPassword,
    goBack,
  };
};
