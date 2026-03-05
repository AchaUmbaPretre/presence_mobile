import { Ionicons } from "@expo/vector-icons";
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
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants/color";
import { getFontFamily } from "./../../../constants/typography";

// ==================== TYPES ====================
interface HeaderProps {
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
}

// ==================== PALETTE DE BLEUS ====================
const BLUE_PRO = {
  primary: "#0A4DA4",
  secondary: "#1E6EC7",
  light: "#E8F0FE",
  dark: "#07317A",
  textLight: "#FFFFFF",
  textDark: "#1E293B",
} as const;

export const Header = memo(
  ({
    userName = "Acha",
    userRole = "Développeur",
    notificationCount = 0,
    onProfilePress,
    onNotificationPress,
  }: HeaderProps) => {
    const scale = useSharedValue(1);
    const notificationScale = useSharedValue(1);

    // Calcul des initiales
    const initials = userName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Animation au toucher du profil
    const handleProfilePress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      scale.value = withSpring(0.9, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });

      onProfilePress?.();
    }, [onProfilePress]);

    // Animation au toucher des notifications
    const handleNotificationPress = useCallback(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      notificationScale.value = withTiming(1.2, { duration: 100 }, () => {
        notificationScale.value = withTiming(1, { duration: 100 });
      });

      onNotificationPress?.();
    }, [onNotificationPress]);

    // Styles animés
    const profileAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const notificationAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: notificationScale.value }],
    }));

    return (
      <Animated.View
        entering={FadeInDown.springify().damping(15)}
        style={styles.container}
      >
        <View style={styles.header}>
          {/* Section titre */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            style={styles.titleSection}
          >
            <Text style={styles.headerTitle}>Dashboard</Text>
            <View style={styles.roleContainer}>
              <Ionicons
                name="briefcase-outline"
                size={14}
                color={BLUE_PRO.textLight}
              />
              <Text style={styles.headerSubtitle}>{userRole}</Text>
            </View>
          </Animated.View>

          {/* Section actions */}
          <View style={styles.actionsSection}>
            {/* Bouton notifications */}
            <Animated.View entering={FadeInRight.delay(150).springify()}>
              <TouchableOpacity
                onPress={handleNotificationPress}
                activeOpacity={0.7}
                style={styles.notificationButton}
              >
                <Animated.View style={notificationAnimatedStyle}>
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={BLUE_PRO.primary}
                  />
                </Animated.View>
                {notificationCount > 0 && (
                  <LinearGradient
                    colors={[COLORS.error.main, COLORS.error.dark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.notificationBadge}
                  >
                    <Text style={styles.notificationBadgeText}>
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Bouton profil */}
            <Animated.View entering={FadeInRight.delay(200).springify()}>
              <TouchableOpacity
                onPress={handleProfilePress}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[styles.profileBadge, profileAnimatedStyle]}
                >
                  <LinearGradient
                    colors={[BLUE_PRO.primary, BLUE_PRO.dark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileGradient}
                  >
                    <Text style={styles.profileInitials}>{initials}</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Ligne décorative */}
        <View style={styles.decorativeLine}>
          <LinearGradient
            colors={[BLUE_PRO.textLight, BLUE_PRO.primary, BLUE_PRO.textLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.decorativeGradient}
          />
        </View>
      </Animated.View>
    );
  },
);

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleSection: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: getFontFamily("bold"),
    color: BLUE_PRO.textLight, // Blanc pour le titre
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: BLUE_PRO.textLight, // Blanc pour le sous-titre
  },
  actionsSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 22,
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
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: BLUE_PRO.textLight,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.error.main,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  notificationBadgeText: {
    color: BLUE_PRO.textLight,
    fontSize: 10,
    fontFamily: getFontFamily("bold"),
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: BLUE_PRO.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
    color: BLUE_PRO.textLight,
  },
  decorativeLine: {
    marginTop: 16,
    height: 2,
    width: "40%",
    borderRadius: 1,
    overflow: "hidden",
  },
  decorativeGradient: {
    flex: 1,
    height: "100%",
  },
});

// Ajout du display name
Header.displayName = "Header";
