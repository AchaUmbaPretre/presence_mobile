export const AUTH_MESSAGES = {
  SUCCESS: {
    LOGIN: "Connexion réussie !",
    LOGOUT: "Déconnexion réussie",
  },
  ERROR: {
    REQUIRED_FIELDS: "Veuillez remplir tous les champs",
    INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
    TOKEN_MISSING: "Token manquant dans la réponse",
    NETWORK_ERROR: "Erreur réseau. Vérifiez votre connexion",
    SERVER_ERROR: "Erreur serveur. Réessayez plus tard",
    INVALID_EMAIL: "Format d'email invalide",
    WEAK_PASSWORD: "Le mot de passe doit contenir au moins 6 caractères",
  },
  PLACEHOLDERS: {
    EMAIL: "votre@email.com",
    PASSWORD: "Votre mot de passe",
  },
  LABELS: {
    EMAIL: "Adresse email",
    PASSWORD: "Mot de passe",
    LOGIN: "Se connecter",
    FORGOT_PASSWORD: "Mot de passe oublié ?",
    NO_ACCOUNT: "Vous n'avez pas de compte ? ",
    SIGNUP: "S'inscrire",
  },
} as const;

export const AUTH_VALIDATION = {
  PASSWORD_MIN_LENGTH: 4,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
