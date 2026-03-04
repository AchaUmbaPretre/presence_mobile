import { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface AnimationConfig {
  duration?: number;
  delay?: number;
  useNativeDriver?: boolean;
}

export const useFadeAnimation = (config: AnimationConfig = {}) => {
  const { duration = 400, delay = 0, useNativeDriver = true } = config;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver,
    }).start();
  }, []);

  return fadeAnim;
};

export const useSlideAnimation = (config: AnimationConfig = {}) => {
  const { duration = 400, delay = 0, useNativeDriver = true } = config;

  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver,
    }).start();
  }, []);

  return slideAnim;
};

export const useCombinedAnimation = (config: AnimationConfig = {}) => {
  const fadeAnim = useFadeAnimation(config);
  const slideAnim = useSlideAnimation(config);

  return {
    fadeAnim,
    slideAnim,
    animatedStyle: {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    },
  };
};

export const useScaleAnimation = (config: AnimationConfig = {}) => {
  const { duration = 300, useNativeDriver = true } = config;

  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver,
    }).start();
  }, []);

  return scaleAnim;
};
