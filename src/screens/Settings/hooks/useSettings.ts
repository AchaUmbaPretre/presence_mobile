import { useCallback, useState } from "react";
import { Alert, Linking, Share, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import * as Updates from "expo-updates";
import { SettingsState } from "../types/settings.types";
import {
  ALERT_MESSAGES,
  LANGUAGE_OPTIONS,
  URLS,
} from "../constants/settings.constants";

export const useSettings = () => {
  const [state, setState] = useState<SettingsState>({
    notificationsEnabled: true,
    darkModeEnabled: false,
    biometricsEnabled: false,
    autoSyncEnabled: true,
    language: "Français",
    cacheSize: "128 MB",
  });

  const updateState = useCallback(<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleToggle = useCallback((id: string) => {
    Haptics.selectionAsync();

    switch (id) {
      case "notifications":
        setState(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
        break;
      case "darkmode":
        setState(prev => ({ ...prev, darkModeEnabled: !prev.darkModeEnabled }));
        break;
      case "biometrics":
        setState(prev => ({ ...prev, biometricsEnabled: !prev.biometricsEnabled }));
        break;
      case "autosync":
        setState(prev => ({ ...prev, autoSyncEnabled: !prev.autoSyncEnabled }));
        break;
    }
  }, []);

  const handleLanguageSelect = useCallback(() => {
    Alert.alert(
      ALERT_MESSAGES.LANGUAGE.title,
      "Sélectionnez votre langue préférée",
      [
        ...LANGUAGE_OPTIONS.map(option => ({
          text: option.label,
          onPress: () => updateState("language", option.value),
        })),
        { text: ALERT_MESSAGES.LANGUAGE.cancel, style: "cancel" },
      ]
    );
  }, [updateState]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      ALERT_MESSAGES.CACHE.title,
      ALERT_MESSAGES.CACHE.message,
      [
        { text: ALERT_MESSAGES.CACHE.cancel, style: "cancel" },
        {
          text: ALERT_MESSAGES.CACHE.confirm,
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            updateState("cacheSize", "0 MB");
            Alert.alert("Succès", ALERT_MESSAGES.CACHE.success);
          },
        },
      ],
    );
  }, [updateState]);

  const handleExportData = useCallback(() => {
    Alert.alert(
      ALERT_MESSAGES.EXPORT.title,
      ALERT_MESSAGES.EXPORT.message,
      [
        { text: ALERT_MESSAGES.EXPORT.cancel, style: "cancel" },
        {
          text: ALERT_MESSAGES.EXPORT.confirm,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Succès", ALERT_MESSAGES.EXPORT.success);
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
      ALERT_MESSAGES.DELETE_ACCOUNT.title,
      ALERT_MESSAGES.DELETE_ACCOUNT.message,
      [
        { text: ALERT_MESSAGES.DELETE_ACCOUNT.cancel, style: "cancel" },
        {
          text: ALERT_MESSAGES.DELETE_ACCOUNT.confirm,
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
          ALERT_MESSAGES.UPDATE.title,
          ALERT_MESSAGES.UPDATE.message,
          [
            { text: ALERT_MESSAGES.UPDATE.cancel, style: "cancel" },
            {
              text: ALERT_MESSAGES.UPDATE.confirm,
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              },
            },
          ],
        );
      } else {
        Alert.alert(ALERT_MESSAGES.UPDATE.upToDate, ALERT_MESSAGES.UPDATE.upToDateMessage);
      }
    } catch (error) {
      Alert.alert("Erreur", ALERT_MESSAGES.UPDATE.error);
    }
  }, []);

  const handleRateApp = useCallback(() => {
    const url = Platform.select(URLS.APP_STORE);
    if (url) {
      Linking.openURL(url);
    }
  }, []);

  const handleShareApp = useCallback(async () => {
    try {
      await Share.share({
        message: "Découvrez cette application géniale !",
        url: URLS.SHARE,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleContact = useCallback(() => {
    Linking.openURL(`mailto:${URLS.EMAIL}`);
  }, []);

  const handleResetSettings = useCallback(() => {
    Alert.alert(
      ALERT_MESSAGES.RESET.title,
      ALERT_MESSAGES.RESET.message,
      [
        { text: ALERT_MESSAGES.RESET.cancel, style: "cancel" },
        {
          text: ALERT_MESSAGES.RESET.confirm,
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setState({
              notificationsEnabled: true,
              darkModeEnabled: false,
              biometricsEnabled: false,
              autoSyncEnabled: true,
              language: "Français",
              cacheSize: "128 MB",
            });
            Alert.alert("Succès", ALERT_MESSAGES.RESET.success);
          },
        },
      ],
    );
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      ALERT_MESSAGES.LOGOUT.title,
      ALERT_MESSAGES.LOGOUT.message,
      [
        { text: ALERT_MESSAGES.LOGOUT.cancel, style: "cancel" },
        {
          text: ALERT_MESSAGES.LOGOUT.confirm,
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  }, []);

  return {
    state,
    handlers: {
      handleToggle,
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
    },
  };
};