// components/PresenceCards.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Images } from "../../../assets/index";
import { COLORS } from "../constants/color";
import { PresenceState } from "../types/presence.types";
import { getFontFamily } from "./../../../constants/typography";
import { Card } from "./Card";

const BLUE_PRO = {
  primary: "#0A4DA4",
  secondary: "#1E6EC7",
  light: "#E8F0FE",
  dark: "#07317A",
  textLight: "#FFFFFF",
  textBlue: "#1E3A5F",
  textMuted: "#5A6B7A",
} as const;

interface PresenceCardsProps {
  presence: PresenceState;
  isLoading?: boolean;
}

export const PresenceCards = memo(
  ({ presence, isLoading = false }: PresenceCardsProps) => {
    // ✅ Fonction pour formater l'heure
    const formatTime = (time: string | null): string => {
      if (!time) return "--:--";
      // Si l'heure est déjà au format HH:MM, la retourner directement
      if (time.match(/^\d{2}:\d{2}$/)) {
        return time;
      }
      // Sinon, essayer de parser
      try {
        const date = new Date(time);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      } catch (e) {
        console.error("Erreur formatage heure:", e);
      }
      return time || "--:--";
    };

    // Rendu d'une carte d'affichage (sans interaction)
    const renderCard = (
      type: "ENTREE" | "SORTIE",
      time: string | null,
      icon: any,
      label: string,
      delay: number,
    ) => {
      const isActive = !!time;
      const isEntry = type === "ENTREE";
      const accentColor = isEntry ? BLUE_PRO.primary : BLUE_PRO.secondary;
      const formattedTime = formatTime(time);

      console.log(`Rendu carte ${label}:`, { time, formattedTime, isActive });

      return (
        <Animated.View
          entering={FadeInDown.delay(delay).springify().damping(15)}
          style={{ flex: 1 }}
        >
          <Card active={isActive} style={styles.card}>
            <LinearGradient
              colors={
                isActive
                  ? [BLUE_PRO.light, COLORS.white]
                  : [COLORS.white, COLORS.gray[50]]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    isActive && { backgroundColor: accentColor + "15" },
                  ]}
                >
                  <Image
                    source={icon}
                    style={[
                      styles.cardIcon,
                      isActive && { tintColor: accentColor },
                    ]}
                  />
                </View>

                {/* Texte */}
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.cardLabel,
                      isActive && styles.cardLabelActive,
                    ]}
                  >
                    {label}
                  </Text>

                  {isLoading ? (
                    <ActivityIndicator size="small" color={accentColor} />
                  ) : (
                    <Text
                      style={[
                        styles.cardTime,
                        isActive && styles.cardTimeActive,
                      ]}
                    >
                      {formattedTime}
                    </Text>
                  )}
                </View>

                {/* Badge de confirmation avec dégradé */}
                {isActive && (
                  <LinearGradient
                    colors={[accentColor, accentColor + "CC"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.badge}
                  >
                    <Text style={styles.badgeText}>✓</Text>
                  </LinearGradient>
                )}
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>
      );
    };

    return (
      <View style={styles.presenceGrid}>
        {renderCard(
          "ENTREE",
          presence.heure_entree,
          Images.arriveeIcon,
          "Arrivée",
          100,
        )}

        {renderCard(
          "SORTIE",
          presence.heure_sortie,
          Images.departIcon,
          "Départ",
          200,
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  presenceGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardGradient: {
    padding: 16,
    position: "relative",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BLUE_PRO.light,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    tintColor: BLUE_PRO.primary,
  },
  textContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: BLUE_PRO.textBlue,
    marginBottom: 4,
    opacity: 0.7,
  },
  cardLabelActive: {
    color: BLUE_PRO.primary,
    fontFamily: getFontFamily("semibold"),
    opacity: 1,
  },
  cardTime: {
    fontSize: 20,
    fontFamily: Platform.select({
      ios: "SF-Mono-Regular",
      android: "monospace",
      default: "monospace",
    }),
    color: BLUE_PRO.textBlue,
    opacity: 0.5,
  },
  cardTimeActive: {
    color: BLUE_PRO.primary,
    fontFamily: Platform.select({
      ios: "SF-Mono-Medium",
      android: "monospace",
      default: "monospace",
    }),
    opacity: 1,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: getFontFamily("bold"),
  },
});

PresenceCards.displayName = "PresenceCards";
