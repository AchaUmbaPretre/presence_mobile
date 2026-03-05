import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native"; // ← Ajout de Text et Platform
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFontFamily } from "../../constants/typography";
import { COLORS } from "./../dashboard/constants/color";
import { SettingsFooter } from "./../Settings/components/SettingsFooter";
import { SettingsHeader } from "./../Settings/components/SettingsHeader";
import { SettingsSection } from "./../Settings/components/SettingsSection";
import { StorageProgress } from "./../Settings/components/StorageProgress";
import { useSettings } from "./../Settings/hooks/useSettings";
import { useSettingsAnimation } from "./../Settings/hooks/useSettingsAnimation";
import { useSettingsSections } from "./../Settings/hooks/useSettingsSections";

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { state, handlers } = useSettings();
  const { sections } = useSettingsSections({ state, handlers });
  const { scrollHandler, headerAnimatedStyle } = useSettingsAnimation();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SettingsHeader style={headerAnimatedStyle} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <Animated.View
          entering={FadeInUp.springify()}
          style={styles.headerContent}
        >
          <LinearGradient
            colors={[COLORS.primary.light, COLORS.white]}
            style={styles.headerGradientContent}
          >
            <Ionicons name="settings" size={48} color={COLORS.primary.main} />
            <Text style={styles.headerSubtitle}>
              Personnalisez votre expérience
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <StorageProgress />
        </Animated.View>

        {sections.map((section, index) => (
          <SettingsSection
            key={section.id}
            section={section}
            index={index}
            toggleValues={{
              notificationsEnabled: state.notificationsEnabled,
              darkModeEnabled: state.darkModeEnabled,
              biometricsEnabled: state.biometricsEnabled,
              autoSyncEnabled: state.autoSyncEnabled,
            }}
            onToggle={handlers.handleToggle}
          />
        ))}

        <SettingsFooter />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginTop: 40,
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
  headerGradientContent: {
    alignItems: "center",
    padding: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    marginTop: 8,
  },
});

export default SettingsScreen;
