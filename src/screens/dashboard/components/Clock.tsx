import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useRef } from "react";
import {
    Platform,
    Animated as RNAnimated,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getFontFamily } from "./../../../constants/typography";

// ==================== PALETTE DE BLEUS ====================
const BLUE_PRO = {
  primary: "#0A4DA4",
  secondary: "#1E6EC7",
  light: "#E8F0FE",
  dark: "#07317A",
  textLight: "#FFFFFF",
  textBlue: "#8e9dc4ff",
  textMuted: "#5A6B7A",
} as const;

// ==================== TYPES ====================
interface ClockProps {
  time: string;
  seconds: string;
  date: string;
  animated?: boolean;
  showSeconds?: boolean;
  variant?: "default" | "compact" | "large";
}

// ==================== COMPOSANT PRINCIPAL ====================
export const Clock = memo(
  ({
    time,
    seconds,
    date,
    animated = true,
    showSeconds = true,
    variant = "default",
  }: ClockProps) => {
    // Animation de pulsation pour les secondes
    const pulseAnim = useSharedValue(1);
    const dotAnim = useRef(new RNAnimated.Value(1)).current;

    useEffect(() => {
      if (animated) {
        // Animation de pulsation pour les secondes
        pulseAnim.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: 500 }),
            withTiming(1, { duration: 500 }),
          ),
          -1,
          true,
        );

        // Animation du point (clignotement)
        RNAnimated.loop(
          RNAnimated.sequence([
            RNAnimated.timing(dotAnim, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
            RNAnimated.timing(dotAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }
    }, [animated]);

    // Styles animés
    const secondsAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pulseAnim.value }],
    }));

    // Configuration selon la variante
    const getVariantStyles = () => {
      switch (variant) {
        case "compact":
          return {
            timeSize: 24,
            secondsSize: 12,
          };
        case "large":
          return {
            timeSize: 42,
            secondsSize: 20,
          };
        default:
          return {
            timeSize: 32,
            secondsSize: 14,
          };
      }
    };

    const variantStyles = getVariantStyles();

    // Formatage de la date
    const formatDate = (dateString: string) => {
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    };

    return (
      <Animated.View
        entering={animated ? FadeInRight.springify().damping(15) : undefined}
        style={styles.container}
      >
        {/* Date chip avec dégradé bleu */}
        <LinearGradient
          colors={[BLUE_PRO.light, BLUE_PRO.light + "80"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dateChip}
        >
          <Icon
            name="calendar-blank-outline"
            size={14}
            color={BLUE_PRO.primary}
          />
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </LinearGradient>

        {/* Horloge */}
        <View style={styles.clockWrapper}>
          <View style={styles.timeWrapper}>
            <Text
              style={[styles.clockTime, { fontSize: variantStyles.timeSize }]}
            >
              {time}
            </Text>

            {/* Point clignotant */}
            {showSeconds && (
              <RNAnimated.View
                style={[
                  styles.dotSeparator,
                  {
                    opacity: dotAnim,
                    height: variantStyles.timeSize * 0.3,
                    backgroundColor: BLUE_PRO.primary,
                  },
                ]}
              />
            )}
          </View>

          {/* Secondes avec dégradé */}
          {showSeconds && (
            <Animated.View
              style={[styles.secondsWrapper, secondsAnimatedStyle]}
            >
              <LinearGradient
                colors={[BLUE_PRO.primary, BLUE_PRO.dark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.secondsBackground,
                  { borderRadius: variantStyles.secondsSize * 0.5 },
                ]}
              >
                <Text
                  style={[
                    styles.clockSeconds,
                    { fontSize: variantStyles.secondsSize },
                  ]}
                >
                  {seconds}
                </Text>
              </LinearGradient>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    );
  },
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: BLUE_PRO.light,
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
  dateText: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: BLUE_PRO.textBlue, // Changé de textDark à textBlue
    marginLeft: 6,
    textTransform: "capitalize",
  },
  clockWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockTime: {
    fontFamily: Platform.select({
      ios: "SF-Mono-Regular",
      android: "monospace",
      default: "monospace",
    }),
    fontWeight: "400",
    color: BLUE_PRO.textBlue, // Changé de textDark à textBlue
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  dotSeparator: {
    width: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
    opacity: 0.5,
  },
  secondsWrapper: {
    marginLeft: 4,
  },
  secondsBackground: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  clockSeconds: {
    fontFamily: Platform.select({
      ios: "SF-Mono-Semibold",
      android: "monospace",
      default: "monospace",
    }),
    color: BLUE_PRO.textLight,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },
});

// Ajout du display name
Clock.displayName = "Clock";
