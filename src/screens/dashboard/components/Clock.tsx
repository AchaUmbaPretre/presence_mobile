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
    FadeInDown,
    FadeInUp,
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
            timeSize: 32,
            secondsSize: 16,
            containerMargin: 16,
          };
        case "large":
          return {
            timeSize: 64,
            secondsSize: 24,
            containerMargin: 32,
          };
        default:
          return {
            timeSize: 48,
            secondsSize: 20,
            containerMargin: 28,
          };
      }
    };

    const variantStyles = getVariantStyles();

    // Formatage de la date
    const formatDate = (dateString: string) => {
      return dateString.charAt(0).toUpperCase() + dateString.slice(1);
    };

    return (
      <>
        {/* Date chip avec gradient */}
        <Animated.View
          entering={animated ? FadeInDown.springify() : undefined}
          style={styles.dateChipContainer}
        >
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
        </Animated.View>

        {/* Horloge principale */}
        <Animated.View
          entering={animated ? FadeInUp.delay(100).springify() : undefined}
          style={[
            styles.clockContainer,
            { marginBottom: variantStyles.containerMargin },
          ]}
        >
          {/* Heures */}
          <View style={styles.timeWrapper}>
            <Text
              style={[styles.clockTime, { fontSize: variantStyles.timeSize }]}
            >
              {time}
            </Text>

            {/* Point clignotant (séparateur) */}
            {showSeconds && (
              <RNAnimated.View
                style={[
                  styles.dotSeparator,
                  { opacity: dotAnim, height: variantStyles.timeSize * 0.3 },
                ]}
              />
            )}
          </View>

          {/* Secondes avec animation */}
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
        </Animated.View>
      </>
    );
  },
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  dateChipContainer: {
    alignSelf: "flex-start",
    marginBottom: 24,
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
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
  },
  dateText: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[700],
    marginLeft: 8,
    textTransform: "capitalize",
  },
  clockContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  clockTime: {
    fontFamily: Platform.select({
      ios: "SF-Mono-Regular",
      android: "monospace",
      default: "monospace",
    }),
    fontWeight: "300",
    color: COLORS.gray[900],
    letterSpacing: -2,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  dotSeparator: {
    width: 4,
    backgroundColor: COLORS.primary.main,
    borderRadius: 2,
    marginHorizontal: 8,
    opacity: 0.5,
  },
  secondsWrapper: {
    marginLeft: 8,
  },
  secondsBackground: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary.main,
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
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
  },
});

// Ajout du display name
Clock.displayName = "Clock";
