import { Platform } from "react-native";

export const TYPOGRAPHY = {
  fonts: {
    regular: "SF-Pro-Text-Regular",
    medium: "SF-Pro-Text-Medium",
    semibold: "SF-Pro-Text-Semibold",
    bold: "SF-Pro-Display-Bold",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
} as const;

// Définir un type pour les variantes de police
type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type FontMap = Record<FontWeight, string>;

// Fallback pour les polices système
const FONT_FALLBACK: Record<string, FontMap> = {
  ios: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
  android: {
    regular: "Roboto",
    medium: "Roboto-Medium",
    semibold: "Roboto-SemiBold",
    bold: "Roboto-Bold",
  },
  default: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
};

// Version avec fonction utilitaire pour obtenir la police appropriée
export const getFontFamily = (
  weight: FontWeight = "regular",
): string => {
  // Essayer d'utiliser SF-Pro d'abord
  if (Platform.OS === "ios") {
    return TYPOGRAPHY.fonts[weight];
  }

  // Fallback pour Android
  const platform = Platform.OS as keyof typeof FONT_FALLBACK;
  return FONT_FALLBACK[platform]?.[weight] || FONT_FALLBACK.default[weight];
};