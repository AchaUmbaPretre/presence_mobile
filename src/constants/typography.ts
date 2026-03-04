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

// Fallback pour les polices système si SF-Pro n'est pas disponible
export const FONT_FALLBACK = Platform.select({
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
});
