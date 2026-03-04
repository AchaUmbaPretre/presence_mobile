import { loginSuccess } from "@/redux/authSlice";
import { handleApiError } from "@/shared/utils/errorHandler";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { isFormValid, validateLoginForm } from "../schemas/validation.schema";
import { authService } from "../services/authService";
import { LoginFormData, ValidationErrors } from "../types/auth.types";

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const updateField = useCallback(
    (field: keyof LoginFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Effacer l'erreur du champ quand l'utilisateur tape
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const validationErrors = validateLoginForm(formData);
    setErrors(validationErrors);
    return isFormValid(validationErrors);
  }, [formData]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert("Erreur de validation", Object.values(errors)[0]);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        username: formData.email,
        password: formData.password,
      });

      const { accessToken, user } = response;

      if (accessToken) {
        dispatch(loginSuccess({ token: accessToken, user }));
        Alert.alert("Succès", AUTH_MESSAGES.SUCCESS.LOGIN);
        router.replace("/(tabs)/home");
      } else {
        throw new Error(AUTH_MESSAGES.ERROR.TOKEN_MISSING);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert("Échec de la connexion", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, dispatch, router]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const setFocus = useCallback((inputName: string | null) => {
    setFocusedInput(inputName);
  }, []);

  return {
    formData,
    errors,
    loading,
    showPassword,
    focusedInput,
    updateField,
    handleLogin,
    togglePasswordVisibility,
    setFocus,
  };
};
