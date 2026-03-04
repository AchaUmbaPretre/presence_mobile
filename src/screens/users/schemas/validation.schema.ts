import { AUTH_MESSAGES, AUTH_VALIDATION } from "../constants/auth.constants";
import { LoginFormData, ValidationErrors } from "../types/auth.types";

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validation email
  if (!data.email) {
    errors.email = AUTH_MESSAGES.ERROR.REQUIRED_FIELDS;
  } else if (!AUTH_VALIDATION.EMAIL_REGEX.test(data.email)) {
    errors.email = AUTH_MESSAGES.ERROR.INVALID_EMAIL;
  }

  // Validation password
  if (!data.password) {
    errors.password = AUTH_MESSAGES.ERROR.REQUIRED_FIELDS;
  } else if (data.password.length < AUTH_VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.password = AUTH_MESSAGES.ERROR.WEAK_PASSWORD;
  }

  return errors;
};

export const isFormValid = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
