import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
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
import { ACTIONS_RAPIDES } from "../constants/dashboard.constants";
import { getFontFamily } from "./../../../constants/typography";
import { IconWithBackground } from "./IconWithBackground";

interface QuickActionsProps {
  onActionPress?: (actionLabel: string) => void;
}

// ==================== COMPOSANT PRINCIPAL ====================
export const QuickActions = memo(({ onActionPress }: QuickActionsProps) => {
  // Animations individuelles pour chaque action
  const scaleValues = ACTIONS_RAPIDES.map(() => useSharedValue(1));
  const glowValues = ACTIONS_RAPIDES.map(() => useSharedValue(0));

  // Gestion du clic
  const handlePress = useCallback(
    (actionLabel: string, index: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Animation de scale
      scaleValues[index].value = withSpring(0.92, { damping: 12 }, () => {
        scaleValues[index].value = withSpring(1);
      });

      // Animation de glow
      glowValues[index].value = withTiming(1, { duration: 150 }, () => {
        glowValues[index].value = withTiming(0, { duration: 200 });

        // Vérification que onActionPress existe avant de l'appeler
        if (onActionPress) {
          runOnJS(onActionPress)(actionLabel);
        }
      });
    },
    [onActionPress],
  );

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [{ scale: scaleValues[index].value }],
    }));
  };

  const getGlowStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(glowValues[index].value, [0, 1], [0, 0.2]),
    }));
  };

  const getActionColor = (label: string): string => {
    switch (label) {
      case "QR Code":
        return COLORS.primary.main;
      case "Géoloc":
        return COLORS.success.main;
      case "Historique":
        return COLORS.warning.main;
      case "Rapports":
        return COLORS.secondary?.main || COLORS.primary.main;
      default:
        return COLORS.primary.main;
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <TouchableOpacity
          onPress={() => Haptics.selectionAsync()}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLink}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {/* Grille d'actions - 2 par ligne */}
      <View style={styles.actionsGrid}>
        {ACTIONS_RAPIDES.map((action, index) => {
          const animatedStyle = getAnimatedStyle(index);
          const glowStyle = getGlowStyle(index);
          const actionColor = getActionColor(action.label);

          return (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(100 + index * 50).springify()}
              style={[styles.actionWrapper, animatedStyle]}
            >
              <TouchableOpacity
                style={styles.actionTouchable}
                onPress={() => handlePress(action.label, index)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={[COLORS.white, COLORS.gray[50]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  {/* Effet de glow */}
                  <Animated.View
                    style={[
                      styles.glowEffect,
                      { backgroundColor: actionColor },
                      glowStyle,
                    ]}
                  />

                  {/* Contenu */}
                  <View style={styles.actionContent}>
                    <IconWithBackground
                      name={action.icon}
                      color={actionColor}
                      backgroundColor={`${actionColor}15`}
                      size={22}
                    />

                    <View style={styles.textContainer}>
                      <Text style={styles.actionLabel} numberOfLines={1}>
                        {action.label}
                      </Text>
                      <Text style={styles.actionDescription} numberOfLines={1}>
                        {getActionDescription(action.label)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.arrow,
                        { backgroundColor: `${actionColor}15` },
                      ]}
                    >
                      <Text style={[styles.arrowText, { color: actionColor }]}>
                        →
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
});

const getActionDescription = (label: string): string => {
  switch (label) {
    case "QR Code":
      return "Scanner";
    case "Géoloc":
      return "Localisation";
    case "Historique":
      return "Consultation";
    case "Rapports":
      return "Visualisation";
    default:
      return "Action rapide";
  }
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    letterSpacing: -0.5,
  },
  sectionLink: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.primary.main,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionWrapper: {
    width: "48%",
    borderRadius: 16,
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
  actionTouchable: {
    width: "100%",
  },
  actionGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    backgroundColor: COLORS.white,
    position: "relative",
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textContainer: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 11,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowText: {
    fontSize: 14,
    fontWeight: "300",
  },
});

// Ajout du display name
QuickActions.displayName = "QuickActions";
