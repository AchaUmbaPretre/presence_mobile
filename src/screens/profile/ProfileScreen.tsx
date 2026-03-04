import { logout } from "@/store/authSlice";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { getFontFamily } from "./../../constants/typography";
import { COLORS } from "./../dashboard/constants/color";

// ==================== TYPES ====================
interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  type: "navigation" | "toggle" | "info" | "action";
  onPress?: () => void;
  badge?: number;
  destructive?: boolean;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

// ==================== CONSTANTS ====================
const STATS: StatItem[] = [
  {
    label: "Présences",
    value: "14",
    icon: "calendar",
    color: COLORS.primary.main,
  },
  {
    label: "Retards",
    value: "3",
    icon: "time",
    color: COLORS.warning.main,
  },
  {
    label: "Congés",
    value: "12",
    icon: "umbrella",
    color: COLORS.success.main,
  },
];

// ==================== COMPOSANT PRINCIPAL ====================
const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Données utilisateur (à connecter avec Redux)
  const user = {
    name: "Acha umba",
    email: "achandambi@email.com",
    role: "Développeur",
    avatar:
      "https://thumbs.dreamstime.com/b/generic-male-user-profile-icon-formal-suit-clean-line-art-business-digital-avatars-simple-avatar-wearing-perfect-394004406.jpg",
    department: "Technique",
    joinDate: "Janvier 2026",
  };

  // Menu items
  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "info",
        icon: "person-outline",
        label: "Informations personnelles",
        type: "navigation",
        onPress: () => handleNavigation("Informations"),
      },
      {
        id: "security",
        icon: "lock-closed-outline",
        label: "Sécurité",
        type: "navigation",
        onPress: () => handleNavigation("Sécurité"),
      },
      {
        id: "notifications",
        icon: "notifications-outline",
        label: "Notifications",
        type: "toggle",
        value: notificationsEnabled ? "Activées" : "Désactivées",
      },
      {
        id: "darkmode",
        icon: "moon-outline",
        label: "Mode sombre",
        type: "toggle",
        value: darkModeEnabled ? "Activé" : "Désactivé",
      },
      {
        id: "language",
        icon: "language-outline",
        label: "Langue",
        value: "Français",
        type: "navigation",
        onPress: () => handleNavigation("Langue"),
      },
      {
        id: "help",
        icon: "help-circle-outline",
        label: "Aide & Support",
        type: "navigation",
        onPress: () => handleNavigation("Support"),
      },
      {
        id: "about",
        icon: "information-circle-outline",
        label: "À propos",
        value: "v1.0.0",
        type: "info",
      },
      {
        id: "logout",
        icon: "log-out-outline",
        label: "Déconnexion",
        type: "action",
        destructive: true,
        onPress: handleLogout,
      },
    ],
    [notificationsEnabled, darkModeEnabled],
  );

  // Handlers
  const handleNavigation = useCallback((screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigation vers l'écran (à implémenter)
    console.log(`Naviguer vers ${screen}`);
  }, []);

  const handleToggle = useCallback((item: MenuItem) => {
    Haptics.selectionAsync();
    if (item.id === "notifications") {
      setNotificationsEnabled((prev) => !prev);
    } else if (item.id === "darkmode") {
      setDarkModeEnabled((prev) => !prev);
    }
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            dispatch(logout());
          },
        },
      ],
      { cancelable: true },
    );
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Simuler un rechargement
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Animation du header
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1]);
    const height = interpolate(scrollY.value, [0, 100], [0, 60], "clamp");

    return {
      opacity,
      height,
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.8]);
    const translateY = interpolate(scrollY.value, [0, 100], [0, -20]);

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  // Rendu d'un item de menu
  const renderMenuItem = useCallback(
    (item: MenuItem, index: number) => {
      const isLast = index === menuItems.length - 1;

      return (
        <Animated.View
          key={item.id}
          entering={FadeInDown.delay(200 + index * 50).springify()}
        >
          <TouchableOpacity
            style={[
              styles.menuItem,
              item.destructive && styles.menuItemDestructive,
              isLast && styles.menuItemLast,
            ]}
            onPress={() => {
              if (item.type === "toggle") {
                handleToggle(item);
              } else {
                item.onPress?.();
              }
            }}
            disabled={item.type === "info"}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIconContainer,
                  item.destructive && styles.menuIconDestructive,
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={
                    item.destructive ? COLORS.error.main : COLORS.gray[600]
                  }
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  item.destructive && styles.menuLabelDestructive,
                ]}
              >
                {item.label}
              </Text>
            </View>

            <View style={styles.menuItemRight}>
              {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
              {item.type === "toggle" ? (
                <Switch
                  value={
                    item.id === "notifications"
                      ? notificationsEnabled
                      : darkModeEnabled
                  }
                  onValueChange={() => handleToggle(item)}
                  trackColor={{
                    false: COLORS.gray[300],
                    true: COLORS.primary.main,
                  }}
                  thumbColor={COLORS.white}
                  ios_backgroundColor={COLORS.gray[300]}
                />
              ) : item.type !== "info" ? (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={COLORS.gray[400]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [notificationsEnabled, darkModeEnabled, handleToggle],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header animé */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={[COLORS.primary.main, COLORS.primary.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Profil</Text>
        </LinearGradient>
      </Animated.View>

      {/* Contenu scrollable */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary.main}
            colors={[COLORS.primary.main]}
          />
        }
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* En-tête du profil */}
        <Animated.View
          entering={FadeInUp.springify()}
          style={[styles.profileHeader, avatarAnimatedStyle]}
        >
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[COLORS.primary.light, COLORS.primary.main]}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </LinearGradient>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name="briefcase-outline"
              size={14}
              color={COLORS.primary.main}
            />
            <Text style={styles.roleText}>{user.role}</Text>
          </View>
        </Animated.View>

        {/* Statistiques */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.statsContainer}
        >
          <LinearGradient
            colors={[COLORS.white, COLORS.gray[50]]}
            style={styles.statsGradient}
          >
            {STATS.map((stat, index) => (
              <React.Fragment key={stat.label}>
                <View style={styles.statItem}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: `${stat.color}15` },
                    ]}
                  >
                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                {index < STATS.length - 1 && (
                  <View style={styles.statDivider} />
                )}
              </React.Fragment>
            ))}
          </LinearGradient>
        </Animated.View>

        {/* Informations supplémentaires */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          style={styles.infoContainer}
        >
          <View style={styles.infoRow}>
            <Ionicons
              name="business-outline"
              size={18}
              color={COLORS.gray[500]}
            />
            <Text style={styles.infoLabel}>Département</Text>
            <Text style={styles.infoValue}>{user.department}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.gray[500]}
            />
            <Text style={styles.infoLabel}>Membre depuis</Text>
            <Text style={styles.infoValue}>{user.joinDate}</Text>
          </View>
        </Animated.View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0 • Build 2024.03</Text>
      </Animated.ScrollView>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userName: {
    fontSize: 24,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.primary.main,
    marginLeft: 6,
  },
  statsContainer: {
    marginBottom: 24,
    borderRadius: 20,
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
  statsGradient: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  statDivider: {
    width: 1,
    height: "70%",
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 8,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
  },
  menuContainer: {
    backgroundColor: COLORS.white,
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
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemDestructive: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    marginTop: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.gray[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIconDestructive: {
    backgroundColor: `${COLORS.error.main}15`,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
    flex: 1,
  },
  menuLabelDestructive: {
    color: COLORS.error.main,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuValue: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginRight: 8,
  },
  badge: {
    backgroundColor: COLORS.error.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    marginRight: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: getFontFamily("bold"),
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[400],
    marginTop: 24,
  },
});

export default ProfileScreen;
