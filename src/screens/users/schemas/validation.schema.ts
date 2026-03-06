import { AUTH_MESSAGES, AUTH_VALIDATION } from "../constants/auth.constants";
import { LoginFormData, ValidationErrors } from "../types/auth.types";

/**
 * Valide le formulaire de connexion
 * @param data - Les données du formulaire (email, password)
 * @returns Un objet contenant les erreurs de validation
 */
export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const email = data.email?.trim() || "";
  const password = data.password?.trim() || "";

  // Validation email
  if (!email) {
    errors.email = AUTH_MESSAGES.ERROR.REQUIRED_FIELDS;
  } else if (!AUTH_VALIDATION.EMAIL_REGEX.test(email)) {
    errors.email = AUTH_MESSAGES.ERROR.INVALID_EMAIL;
  }

  // Validation password
  if (!password) {
    errors.password = AUTH_MESSAGES.ERROR.REQUIRED_FIELDS;
  } else if (password.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.password = AUTH_MESSAGES.ERROR.WEAK_PASSWORD;
  }

  return errors;
};

/**
 * Vérifie si le formulaire est valide (aucune erreur)
 * @param errors - Les erreurs de validation
 * @returns true si le formulaire est valide, false sinon
 */
export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};

/**
 * Valide un champ spécifique du formulaire
 * @param field - Le champ à valider ("email" | "password")
 * @param value - La valeur du champ
 * @returns Un message d'erreur ou undefined si valide
 */
export const validateField = (
  field: keyof LoginFormData,
  value: string,
): string | undefined => {
  const trimmedValue = value?.trim() || "";

  switch (field) {
    case "email":
      if (!trimmedValue) {
        return AUTH_MESSAGES.ERROR.REQUIRED_FIELDS;
      }
      if (!AUTH_VALIDATION.EMAIL_REGEX.test(trimmedValue)) {
        return AUTH_MESSAGES.ERROR.INVALID_EMAIL;
      }
      break;

    case "password":
      if (!trimmedValue) {
        return AUTH_MESSAGES.ERROR.REQUIRED_FIELDS;
      }
      if (trimmedValue.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
        return AUTH_MESSAGES.ERROR.WEAK_PASSWORD;
      }
      break;

    default:
      return undefined;
  }

  return undefined;
};
