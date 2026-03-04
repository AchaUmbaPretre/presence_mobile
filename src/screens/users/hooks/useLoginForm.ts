import { loginSuccess } from "@/store/authSlice";
import { handleApiError } from "@/utils/errorHandler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { validateLoginForm } from "../schemas/validation.schema";
import { authService } from "../services/authService";
import { LoginFormData, ValidationErrors } from "../types/auth.types";

// Types de navigation
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  "(tabs)/home": undefined;
  Auth: undefined;
} & AuthStackParamList;

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type FormField = keyof LoginFormData;

const INITIAL_FORM_DATA: LoginFormData = {
  email: "",
  password: "",
};

// Messages d'alerte constants
const ALERT_MESSAGES = {
  VALIDATION_ERROR: "Erreur de validation",
  LOGIN_FAILED: "Échec de la connexion",
  RETRY: "Réessayer",
  OK: "OK",
} as const;

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<FormField | null>(null);

  const dispatch = useDispatch();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Vérification si le formulaire est valide
  const isFormValid = useMemo(
    () => formData.email.trim() !== "" && formData.password.trim() !== "",
    [formData.email, formData.password],
  );

  // Récupérer la première erreur
  const firstError = useMemo(() => Object.values(errors)[0], [errors]);

  // Mise à jour d'un champ
  const updateField = useCallback((field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  // Réinitialisation du formulaire
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setFocusedInput(null);
  }, []);

  // Gestion de la connexion
  const handleLogin = useCallback(async () => {
    // Validation
    if (!validateForm()) {
      Alert.alert(
        ALERT_MESSAGES.VALIDATION_ERROR,
        firstError || "Veuillez vérifier vos champs",
        [{ text: ALERT_MESSAGES.OK }],
      );
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

      // Succès de la connexion
      dispatch(loginSuccess({ token: accessToken, user }));

      // Réinitialisation du formulaire
      resetForm();

      // Navigation vers l'écran d'accueil
      navigation.reset({
        index: 0,
        routes: [{ name: "(tabs)/home" }],
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert(ALERT_MESSAGES.LOGIN_FAILED, errorMessage, [
        { text: ALERT_MESSAGES.RETRY, style: "default" },
      ]);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, firstError, resetForm, dispatch, navigation]);

  // Basculer la visibilité du mot de passe
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Gestion du focus
  const handleFocus = useCallback((field: FormField) => {
    setFocusedInput(field);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedInput(null);
  }, []);

  // Navigation
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

  // Actions - Notez que c'est handleFocus, pas setFocus
  updateField,
  handleLogin,
  togglePasswordVisibility,
  handleFocus,  // ← C'est handleFocus, pas setFocus
  handleBlur,
  resetForm,

  // Navigation
  goToSignup,
  goToForgotPassword,
  goBack,
};
};
