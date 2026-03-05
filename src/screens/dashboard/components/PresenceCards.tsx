import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import {
    ActivityIndicator,
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeInDown,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants/color";
import { PresenceState } from "../types/presence.types";
import { Images } from "./../../../../assets/index";
import { getFontFamily } from "./../../../constants/typography";
import { Card } from "./Card";

// ==================== PALETTE DE BLEUS ====================
const BLUE_PRO = {
  primary: "#0A4DA4",
  secondary: "#1E6EC7",
  light: "#E8F0FE",
  dark: "#07317A",
  textLight: "#FFFFFF",
  textBlue: "#1E3A5F", // Bleu profond élégant
  textMuted: "#5A6B7A", // Bleu-gris secondaire
} as const;

// ==================== TYPES ====================
interface PresenceCardsProps {
  presence: PresenceState;
  onPointage: (type: "ENTREE" | "SORTIE") => void;
  isLoading?: boolean;
}

// ==================== COMPOSANT PRINCIPAL ====================
export const PresenceCards = memo(
  ({ presence, onPointage, isLoading = false }: PresenceCardsProps) => {
    const isEntryDisabled = !!presence.heure_entree;
    const isExitDisabled = !presence.heure_entree || !!presence.heure_sortie;

    // Animations
    const entryScale = useSharedValue(1);
    const exitScale = useSharedValue(1);
    const entryGlow = useSharedValue(0);
    const exitGlow = useSharedValue(0);

    // Gestion du clic
    const handlePress = useCallback(
      (type: "ENTREE" | "SORTIE") => {
        const isDisabled = type === "ENTREE" ? isEntryDisabled : isExitDisabled;

        if (isDisabled || isLoading) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const scale = type === "ENTREE" ? entryScale : exitScale;
        const glow = type === "ENTREE" ? entryGlow : exitGlow;

        scale.value = withSpring(0.95, { damping: 12 }, () => {
          scale.value = withSpring(1);
        });

        glow.value = withTiming(1, { duration: 200 }, () => {
          glow.value = withTiming(0, { duration: 300 });
          runOnJS(onPointage)(type);
        });
      },
      [isEntryDisabled, isExitDisabled, isLoading, onPointage],
    );

    // Styles animés
    const entryAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: entryScale.value }],
    }));

    const exitAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: exitScale.value }],
    }));

    const entryGlowStyle = useAnimatedStyle(() => ({
      opacity: interpolate(entryGlow.value, [0, 1], [0, 0.15]),
    }));

    const exitGlowStyle = useAnimatedStyle(() => ({
      opacity: interpolate(exitGlow.value, [0, 1], [0, 0.15]),
    }));

    // Rendu d'une carte
    const renderCard = (
      type: "ENTREE" | "SORTIE",
      time: string | null,
      icon: any,
      label: string,
      animatedStyle: any,
      glowStyle: any,
      delay: number,
    ) => {
      const isActive = !!time;
      const isEntry = type === "ENTREE";
      const accentColor = isEntry ? BLUE_PRO.primary : BLUE_PRO.secondary;

      return (
        <Animated.View
          entering={FadeInDown.delay(delay).springify().damping(15)}
          style={[{ flex: 1 }, animatedStyle]}
        >
          <Card
            onPress={() => handlePress(type)}
            disabled={isEntry ? isEntryDisabled : isExitDisabled}
            active={isActive}
            style={styles.card}
          >
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
              <Animated.View
                style={[
                  styles.glowEffect,
                  { backgroundColor: accentColor },
                  glowStyle,
                ]}
              />

              <View style={styles.cardContent}>
                {/* Icône avec fond */}
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
                      {time || "--:--"}
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
          entryAnimatedStyle,
          entryGlowStyle,
          100,
        )}

        {renderCard(
          "SORTIE",
          presence.heure_sortie,
          Images.departIcon,
          "Départ",
          exitAnimatedStyle,
          exitGlowStyle,
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
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
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
    color: BLUE_PRO.textBlue, // Changé de textDark à textBlue
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
    color: BLUE_PRO.textBlue, // Changé de textDark à textBlue
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

// Ajout du display name
PresenceCards.displayName = "PresenceCards";
