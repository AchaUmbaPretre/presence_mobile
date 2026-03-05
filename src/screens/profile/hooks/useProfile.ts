import { logout } from "@/store/authSlice";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { ALERT_MESSAGES, MOCK_USER } from "../constants/profile.constants";
import { ProfileState, User } from "../types/profile.types";

export const useProfile = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState<ProfileState>({
    notificationsEnabled: true,
    darkModeEnabled: false,
    refreshing: false,
  });

  const [user] = useState<User>(MOCK_USER);

  const toggleNotification = useCallback(() => {
    Haptics.selectionAsync();
    setState((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    Haptics.selectionAsync();
    setState((prev) => ({ ...prev, darkModeEnabled: !prev.darkModeEnabled }));
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
            dispatch(logout());
          },
        },
      ],
      { cancelable: true },
    );
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, refreshing: true }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      setState((prev) => ({ ...prev, refreshing: false }));
    }, 1500);
  }, []);

  return {
    user,
    state,
    toggleNotification,
    toggleDarkMode,
    handleLogout,
    onRefresh,
  };
};
