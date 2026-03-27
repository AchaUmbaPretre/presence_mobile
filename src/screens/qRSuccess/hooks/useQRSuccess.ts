// screens/qr-success/hooks/useQRSuccess.ts
import { AppStackParamList } from "@/navigation/AppNavigator";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  InteractionManager,
  Vibration
} from "react-native";
import { createAnimations } from "../animations/createAnimations";
import { getSuccessConfig  } from "../config/successConfig";
import { formatDateTime, FormattedDateTime } from "@/screens/dashboard/constants/dashboard.constants";

interface QRSuccessParams {
  message: string;
  typeScan: "ENTREE" | "SORTIE";
  siteName: string;
  zoneName?: string;
  distance?: number;
  isWithinZone?: boolean;
  retard_minutes?: number;
  heures_supplementaires?: number;
  scan_time?: string;
}

export const useQRSuccess = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute();
  const params = route.params as QRSuccessParams;

  const [showConfetti, setShowConfetti] = useState(true);
  const [cardExpanded, setCardExpanded] = useState(false);

  const animations = useRef(createAnimations()).current;

  const startConfettiAnimation = useCallback(() => {
    const duration = 2500;
    const startTime = Date.now();

    const animateConfetti = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < duration && showConfetti) {
        requestAnimationFrame(animateConfetti);
      } else {
        setShowConfetti(false);
      }
    };

    requestAnimationFrame(animateConfetti);
  }, [showConfetti]);

  useEffect(() => {
    animations.startEntryAnimations();
    animations.startPulseLoop();
    animations.startShimmerLoop();
    animations.startGlowLoop();
    animations.startBackgroundLoop();

    // Feedback haptique
    InteractionManager.runAfterInteractions(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Vibration.vibrate(50);
      }, 200);
    });

    startConfettiAnimation();

    // Gestion bouton retour
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate("Tabs");
        return true;
      },
    );

    return () => {
      backHandler.remove();
      animations.cleanup();
    };
  }, []);

  const config = getSuccessConfig(params.typeScan);
  
  const dateTime: FormattedDateTime = formatDateTime(
    params.scan_time ? new Date(params.scan_time) : new Date(),
  );

  const handlers = {
    goToHome: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("Tabs");
    },
    goToHistory: () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("Historique");
    },
    toggleCardExpand: () => setCardExpanded((prev) => !prev),
  };

  const uiState = {
    showConfetti,
    cardExpanded,
  };

  return {
    params,
    config,
    animations: {
      fadeAnim: animations.fadeAnim,
      scaleAnim: animations.scaleAnim,
      translateYAnim: animations.translateYAnim,
      pulseAnim: animations.pulseAnim,
      spin: animations.spin,
      shimmerTranslate: animations.shimmerTranslate,
      borderGlow: animations.borderGlow,
      backgroundShift: animations.backgroundShift,
    },
    handlers,
    uiState,
    dateTime,
  };
};