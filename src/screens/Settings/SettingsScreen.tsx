import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import * as Updates from "expo-updates";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Share,
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
import { getFontFamily } from "./../../constants/typography";
import { COLORS } from "./../../screens/dashboard/constants/color";

interface SettingSection {
  id: string;
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  type: "toggle" | "navigation" | "info" | "action" | "select";
  onPress?: () => void;
  destructive?: boolean;
  badge?: number;
  disabled?: boolean;
}

interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}

const manifest =
  Constants.manifest || Constants.manifest2?.extra?.expoClient || {};
const APP_VERSION = manifest.version || "1.0.0";
const BUILD_NUMBER =
  Platform.OS === "ios"
    ? manifest.ios?.buildNumber || "1"
    : manifest.android?.versionCode?.toString() || "1";

const STORAGE_INFO: StorageInfo = {
  used: 2.4,
  total: 16,
  percentage: 15,
};

const supportsBiometrics = Platform.select({
  ios: true,
  android: true,
  default: false,
});

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [language, setLanguage] = useState("Français");
  const [cacheSize, setCacheSize] = useState("128 MB");

  // Handlers
  const handleToggle = useCallback((item: SettingItem) => {
    Haptics.selectionAsync();

    switch (item.id) {
      case "notifications":
        setNotificationsEnabled((prev) => !prev);
        break;
      case "darkmode":
        setDarkModeEnabled((prev) => !prev);
        break;
      case "biometrics":
        setBiometricsEnabled((prev) => !prev);
        break;
      case "autosync":
        setAutoSyncEnabled((prev) => !prev);
        break;
    }
  }, []);

  const handleLanguageSelect = useCallback(() => {
    Alert.alert("Choisir la langue", "Sélectionnez votre langue préférée", [
      { text: "Français", onPress: () => setLanguage("Français") },
      { text: "English", onPress: () => setLanguage("English") },
      { text: "Español", onPress: () => setLanguage("Español") },
      { text: "Annuler", style: "cancel" },
    ]);
  }, []);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      "Vider le cache",
      "Cette action supprimera les données temporaires. Êtes-vous sûr ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCacheSize("0 MB");
            Alert.alert("Succès", "Cache vidé avec succès");
          },
        },
      ],
    );
  }, []);

  const handleExportData = useCallback(() => {
    Alert.alert(
      "Exporter mes données",
      "Vos données seront exportées au format JSON. Voulez-vous continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Exporter",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Succès", "Export démarré");
          },
        },
      ],
    );
  }, []);

  const handleOpenLink = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  }, []);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "Supprimer le compte",
      "Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ],
    );
  }, []);

  const handleCheckUpdates = useCallback(async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          "Mise à jour disponible",
          "Une nouvelle version est disponible. Voulez-vous la télécharger ?",
          [
            { text: "Plus tard", style: "cancel" },
            {
              text: "Mettre à jour",
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ],
        );
      } else {
        Alert.alert("À jour", "Vous utilisez la dernière version");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de vérifier les mises à jour");
    }
  }, []);

  const handleRateApp = useCallback(() => {
    const url = Platform.select({
      ios: "https://apps.apple.com/app/id123456789",
      android: "https://play.google.com/store/apps/details?id=com.yourapp",
    });
    if (url) {
      Linking.openURL(url);
    }
  }, []);

  const handleShareApp = useCallback(async () => {
    try {
      await Share.share({
        message: "Découvrez cette application géniale !",
        url: "https://example.com/app",
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleContact = useCallback(() => {
    Linking.openURL("mailto:support@example.com?subject=Support");
  }, []);

  const handleResetSettings = useCallback(() => {
    Alert.alert(
      "Réinitialiser les paramètres",
      "Tous vos paramètres seront réinitialisés. Êtes-vous sûr ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setNotificationsEnabled(true);
            setDarkModeEnabled(false);
            setBiometricsEnabled(false);
            setAutoSyncEnabled(true);
            setLanguage("Français");
            Alert.alert("Succès", "Paramètres réinitialisés");
          },
        },
      ],
    );
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }, []);

  // Animation du scroll
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [0, 1]);
    return { opacity };
  });

  // Rendu d'un item (défini AVANT renderSection)
  const renderItem = useCallback(
    (item: SettingItem) => {
      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.item, item.disabled && styles.itemDisabled]}
          onPress={() => {
            if (item.disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (item.type === "toggle") {
              handleToggle(item);
            } else {
              item.onPress?.();
            }
          }}
          activeOpacity={item.disabled ? 1 : 0.7}
        >
          <View style={styles.itemLeft}>
            <View
              style={[
                styles.itemIcon,
                item.destructive && styles.itemIconDestructive,
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={
                  item.destructive
                    ? COLORS.error.main
                    : item.disabled
                      ? COLORS.gray[400]
                      : COLORS.gray[600]
                }
              />
            </View>
            <View style={styles.itemLabelContainer}>
              <Text
                style={[
                  styles.itemLabel,
                  item.destructive && styles.itemLabelDestructive,
                  item.disabled && styles.itemLabelDisabled,
                ]}
              >
                {item.label}
              </Text>
              {item.value && <Text style={styles.itemValue}>{item.value}</Text>}
            </View>
          </View>

          <View style={styles.itemRight}>
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
                    : item.id === "darkmode"
                      ? darkModeEnabled
                      : item.id === "biometrics"
                        ? biometricsEnabled
                        : autoSyncEnabled
                }
                onValueChange={() => handleToggle(item)}
                trackColor={{
                  false: COLORS.gray[300],
                  true: COLORS.primary.main,
                }}
                thumbColor={COLORS.white}
                ios_backgroundColor={COLORS.gray[300]}
                disabled={item.disabled}
              />
            ) : item.type === "navigation" ? (
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.gray[400]}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      );
    },
    [
      notificationsEnabled,
      darkModeEnabled,
      biometricsEnabled,
      autoSyncEnabled,
      handleToggle,
    ],
  );

  // Rendu d'une section (défini APRÈS renderItem)
  const renderSection = useCallback(
    (section: SettingSection, sectionIndex: number) => (
      <Animated.View
        key={section.id}
        entering={FadeInDown.delay(200 + sectionIndex * 100).springify()}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionContent}>
          {section.items.map((item) => renderItem(item))}
        </View>
      </Animated.View>
    ),
    [renderItem], // Dépendance à renderItem
  );

  // Sections de paramètres (définies APRÈS les handlers)
  const settingsSections: SettingSection[] = useMemo(
    () => [
      {
        id: "preferences",
        title: "Préférences",
        items: [
          {
            id: "notifications",
            icon: "notifications-outline",
            label: "Notifications",
            value: notificationsEnabled ? "Activées" : "Désactivées",
            type: "toggle",
          },
          {
            id: "darkmode",
            icon: "moon-outline",
            label: "Mode sombre",
            value: darkModeEnabled ? "Activé" : "Désactivé",
            type: "toggle",
          },
          {
            id: "biometrics",
            icon: "finger-print-outline",
            label: "Authentification biométrique",
            value: biometricsEnabled ? "Activée" : "Désactivée",
            type: "toggle",
            disabled: !supportsBiometrics,
          },
          {
            id: "language",
            icon: "language-outline",
            label: "Langue",
            value: language,
            type: "navigation",
            onPress: handleLanguageSelect,
          },
        ],
      },
      {
        id: "data",
        title: "Données & Stockage",
        items: [
          {
            id: "autosync",
            icon: "sync-outline",
            label: "Synchronisation auto",
            value: autoSyncEnabled ? "Activée" : "Désactivée",
            type: "toggle",
          },
          {
            id: "cache",
            icon: "folder-outline",
            label: "Cache",
            value: cacheSize,
            type: "navigation",
            onPress: handleClearCache,
          },
          {
            id: "storage",
            icon: "hardware-chip-outline",
            label: "Stockage",
            value: `${STORAGE_INFO.used} GB / ${STORAGE_INFO.total} GB`,
            type: "info",
          },
          {
            id: "export",
            icon: "download-outline",
            label: "Exporter mes données",
            type: "navigation",
            onPress: handleExportData,
          },
        ],
      },
      {
        id: "security",
        title: "Sécurité & Confidentialité",
        items: [
          {
            id: "privacy",
            icon: "shield-checkmark-outline",
            label: "Politique de confidentialité",
            type: "navigation",
            onPress: () => handleOpenLink("https://example.com/privacy"),
          },
          {
            id: "terms",
            icon: "document-text-outline",
            label: "Conditions d'utilisation",
            type: "navigation",
            onPress: () => handleOpenLink("https://example.com/terms"),
          },
          {
            id: "data-deletion",
            icon: "trash-outline",
            label: "Supprimer mon compte",
            type: "action",
            destructive: true,
            onPress: handleDeleteAccount,
          },
        ],
      },
      {
        id: "about",
        title: "À propos",
        items: [
          {
            id: "version",
            icon: "information-circle-outline",
            label: "Version",
            value: `${APP_VERSION} (${BUILD_NUMBER})`,
            type: "info",
          },
          {
            id: "updates",
            icon: "refresh-outline",
            label: "Vérifier les mises à jour",
            type: "navigation",
            onPress: handleCheckUpdates,
          },
          {
            id: "rate",
            icon: "star-outline",
            label: "Noter l'application",
            type: "navigation",
            onPress: handleRateApp,
          },
          {
            id: "share",
            icon: "share-social-outline",
            label: "Partager l'application",
            type: "navigation",
            onPress: handleShareApp,
          },
          {
            id: "contact",
            icon: "mail-outline",
            label: "Nous contacter",
            type: "navigation",
            onPress: handleContact,
          },
        ],
      },
      {
        id: "danger",
        title: "Zone dangereuse",
        items: [
          {
            id: "reset",
            icon: "refresh-circle-outline",
            label: "Réinitialiser les paramètres",
            type: "action",
            destructive: true,
            onPress: handleResetSettings,
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
      },
    ],
    [
      notificationsEnabled,
      darkModeEnabled,
      biometricsEnabled,
      autoSyncEnabled,
      language,
      cacheSize,
      handleLanguageSelect,
      handleClearCache,
      handleExportData,
      handleOpenLink,
      handleDeleteAccount,
      handleCheckUpdates,
      handleRateApp,
      handleShareApp,
      handleContact,
      handleResetSettings,
      handleLogout,
    ],
  );

  // Barre de progression du stockage
  const StorageProgress = useCallback(
    () => (
      <View style={styles.storageContainer}>
        <View style={styles.storageHeader}>
          <Text style={styles.storageLabel}>Stockage utilisé</Text>
          <Text style={styles.storageValue}>
            {STORAGE_INFO.used} GB / {STORAGE_INFO.total} GB
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${STORAGE_INFO.percentage}%` },
            ]}
          />
        </View>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={[COLORS.primary.main, COLORS.primary.dark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Paramètres</Text>
        </LinearGradient>
      </Animated.View>

      {/* Contenu */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* En-tête animé */}
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

        {/* Stockage */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <StorageProgress />
        </Animated.View>

        {/* Sections */}
        {settingsSections.map((section, index) =>
          renderSection(section, index),
        )}

        {/* Footer */}
        <Text style={styles.footerText}>
          © 2024 Your Company. Tous droits réservés.
        </Text>
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
    height: 60,
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
  storageContainer: {
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
  storageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storageLabel: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[700],
  },
  storageValue: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary.main,
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
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
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  itemDisabled: {
    opacity: 0.5,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.gray[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemIconDestructive: {
    backgroundColor: `${COLORS.error.main}15`,
  },
  itemLabelContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 15,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
  },
  itemLabelDestructive: {
    color: COLORS.error.main,
  },
  itemLabelDisabled: {
    color: COLORS.gray[400],
  },
  itemValue: {
    fontSize: 13,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginTop: 2,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
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
  footerText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[400],
    marginTop: 24,
  },
});

export default SettingsScreen;
