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

        scale.value = withSpring(0.95, { damping: 10 }, () => {
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
      opacity: interpolate(entryGlow.value, [0, 1], [0, 0.3]),
    }));

    const exitGlowStyle = useAnimatedStyle(() => ({
      opacity: interpolate(exitGlow.value, [0, 1], [0, 0.3]),
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
    ) => (
      <Animated.View
        entering={FadeInDown.delay(delay).springify()}
        style={[{ flex: 1 }, animatedStyle]}
      >
        <Card
          onPress={() => handlePress(type)}
          disabled={type === "ENTREE" ? isEntryDisabled : isExitDisabled}
          active={!!time}
          style={[styles.card, !!time && styles.cardActive]}
        >
          <LinearGradient
            colors={
              !!time
                ? type === "ENTREE"
                  ? [COLORS.success.light, COLORS.white]
                  : [COLORS.warning.light, COLORS.white]
                : [COLORS.white, COLORS.white]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <Animated.View style={[styles.glowEffect, glowStyle]} />

            <View style={styles.cardContent}>
              <View style={styles.cardIconContainer}>
                <Image source={icon} style={styles.cardIcon} />
                {time && (
                  <View style={styles.checkmark}>
                    <LinearGradient
                      colors={[COLORS.success.main, COLORS.success.dark]}
                      style={styles.checkmarkGradient}
                    >
                      <Text style={styles.checkmarkText}>✓</Text>
                    </LinearGradient>
                  </View>
                )}
              </View>

              <View style={styles.cardTextContainer}>
                <Text
                  style={[styles.cardLabel, !!time && styles.cardLabelActive]}
                >
                  {label}
                </Text>
                <Text
                  style={[styles.cardTime, !!time && styles.cardTimeActive]}
                >
                  {isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={
                        type === "ENTREE"
                          ? COLORS.primary.main
                          : COLORS.warning.main
                      }
                    />
                  ) : (
                    time || "--:--"
                  )}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Card>
      </Animated.View>
    );

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

// ==================== STYLES ====================
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
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardActive: {
    borderColor: COLORS.primary.main,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
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
    backgroundColor: COLORS.primary.main,
    opacity: 0,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardIconContainer: {
    position: "relative",
  },
  cardIcon: {
    height: 50,
    width: 50,
    resizeMode: "contain",
  },
  checkmark: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.success.main,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  checkmarkGradient: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: getFontFamily("bold"),
  },
  cardTextContainer: {
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardLabelActive: {
    color: COLORS.gray[900],
    fontFamily: getFontFamily("semibold"),
  },
  cardTime: {
    fontSize: 20,
    fontFamily: Platform.select({
      ios: "SF-Mono-Regular",
      android: "monospace",
      default: "monospace",
    }),
    color: COLORS.gray[400],
    letterSpacing: 1,
    minHeight: 30,
  },
  cardTimeActive: {
    color: COLORS.gray[900],
    fontFamily: Platform.select({
      ios: "SF-Mono-Semibold",
      android: "monospace",
      default: "monospace",
    }),
  },
});

// Ajout du display name
PresenceCards.displayName = "PresenceCards";
