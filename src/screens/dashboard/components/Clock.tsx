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
import { COLORS } from "../constants/color";
import { getFontFamily } from "./../../../constants/typography";

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
            timeSize: 28,
            secondsSize: 14,
          };
        case "large":
          return {
            timeSize: 48,
            secondsSize: 22,
          };
        default:
          return {
            timeSize: 36,
            secondsSize: 16,
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
        entering={animated ? FadeInRight.springify() : undefined}
        style={styles.container}
      >
        {/* Date chip */}
        <LinearGradient
          colors={[COLORS.gray[50], COLORS.white]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dateChip}
        >
          <Icon
            name="calendar-blank-outline"
            size={14}
            color={COLORS.primary.main}
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
                  { opacity: dotAnim, height: variantStyles.timeSize * 0.3 },
                ]}
              />
            )}
          </View>

          {/* Secondes */}
          {showSeconds && (
            <Animated.View
              style={[styles.secondsWrapper, secondsAnimatedStyle]}
            >
              <LinearGradient
                colors={[COLORS.primary.light, COLORS.primary.main]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
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
    borderColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary.main,
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
    color: COLORS.gray[700],
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
    fontWeight: "300",
    color: COLORS.gray[900],
    letterSpacing: -1,
    includeFontPadding: false,
  },
  dotSeparator: {
    width: 3,
    backgroundColor: COLORS.primary.main,
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
        shadowColor: COLORS.primary.main,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  clockSeconds: {
    fontFamily: Platform.select({
      ios: "SF-Mono-Semibold",
      android: "monospace",
      default: "monospace",
    }),
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },
});

// Ajout du display name
Clock.displayName = "Clock";
