import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native"; // ← Ajout de Text ici
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFontFamily } from "./../../constants/typography";
import { COLORS } from "./../../screens/dashboard/constants/color";
import { ProfileHeader } from "./../profile/components/ProfileHeader";
import { ProfileInfo } from "./../profile/components/ProfileInfo";
import { ProfileMenu } from "./../profile/components/ProfileMenu";
import { ProfileStats } from "./../profile/components/ProfileStats";
import { useProfile } from "./../profile/hooks/useProfile";
import { useProfileAnimation } from "./../profile/hooks/useProfileAnimation";
import { useProfileMenu } from "./../profile/hooks/useProfileMenu";

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    user,
    state,
    toggleNotification,
    toggleDarkMode,
    handleLogout,
    onRefresh,
  } = useProfile();
  const { scrollHandler, headerAnimatedStyle, avatarAnimatedStyle } =
    useProfileAnimation();
  const { menuItems } = useProfileMenu({
    notificationsEnabled: state.notificationsEnabled,
    darkModeEnabled: state.darkModeEnabled,
    onToggleNotification: toggleNotification,
    onToggleDarkMode: toggleDarkMode,
    onLogout: handleLogout,
  });

  const handleToggle = (item: any) => {
    if (item.id === "notifications") toggleNotification();
    if (item.id === "darkmode") toggleDarkMode();
  };

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
            refreshing={state.refreshing}
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
        <ProfileHeader user={user} animatedStyle={avatarAnimatedStyle} />
        <ProfileStats />
        <ProfileInfo user={user} />
        <ProfileMenu
          items={menuItems}
          notificationsEnabled={state.notificationsEnabled}
          darkModeEnabled={state.darkModeEnabled}
          onToggle={handleToggle}
        />
        <Text style={styles.versionText}>Version 1.0.0 • Build 2024.03</Text>
      </Animated.ScrollView>
    </View>
  );
};

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
  versionText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[400],
    marginTop: 24,
  },
});

export default ProfileScreen;
