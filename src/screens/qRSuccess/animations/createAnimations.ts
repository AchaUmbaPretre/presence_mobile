// screens/qr-success/animations/createAnimations.ts
import { Animated, Dimensions, Easing } from 'react-native';

const { width } = Dimensions.get('window');

export const ANIMATION_CONFIG = {
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 180,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  },
  timing: {
    duration: 750,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },
  micro: {
    duration: 300,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
};

export const createAnimations = () => {
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const translateYAnim = new Animated.Value(60);
  const pulseAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);
  const shimmerAnim = new Animated.Value(0);
  const borderGlowAnim = new Animated.Value(0);
  const backgroundShiftAnim = new Animated.Value(0);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  const borderGlow = borderGlowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 8, 0],
  });

  const backgroundShift = backgroundShiftAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const startEntryAnimations = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, ...ANIMATION_CONFIG.spring }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true, easing: ANIMATION_CONFIG.timing.easing }),
      Animated.spring(translateYAnim, { toValue: 0, useNativeDriver: true, ...ANIMATION_CONFIG.spring }),
    ]).start();
  };

  const startPulseLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ])
    ).start();
  };

  const startShimmerLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, easing: Easing.linear, useNativeDriver: true }),
      ])
    ).start();
  };

  const startGlowLoop = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderGlowAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(borderGlowAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ])
    ).start();
  };

  const startBackgroundLoop = () => {
    Animated.loop(
      Animated.timing(backgroundShiftAnim, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  };

  const cleanup = () => {
    // Arrêter les animations si nécessaire
  };

  return {
    // Valeurs animées
    scaleAnim,
    fadeAnim,
    translateYAnim,
    pulseAnim,
    rotateAnim,
    shimmerAnim,
    borderGlowAnim,
    backgroundShiftAnim,
    // Interpolations
    spin,
    shimmerTranslate,
    borderGlow,        // ✅ Ajout de borderGlow (interpolation)
    backgroundShift,
    // Méthodes
    startEntryAnimations,
    startPulseLoop,
    startShimmerLoop,
    startGlowLoop,
    startBackgroundLoop,
    cleanup,
  };
};