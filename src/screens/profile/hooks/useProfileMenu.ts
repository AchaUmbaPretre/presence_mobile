import { useCallback, useMemo } from "react";
import * as Haptics from "expo-haptics";
import { MenuItem } from "../types/profile.types";

interface UseProfileMenuProps {
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  onToggleNotification: () => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

export const useProfileMenu = ({
  notificationsEnabled,
  darkModeEnabled,
  onToggleNotification,
  onToggleDarkMode,
  onLogout,
}: UseProfileMenuProps) => {
  const handleNavigation = useCallback((screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Naviguer vers ${screen}`);
  }, []);

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
        onPress: onToggleNotification,
      },
      {
        id: "darkmode",
        icon: "moon-outline",
        label: "Mode sombre",
        type: "toggle",
        value: darkModeEnabled ? "Activé" : "Désactivé",
        onPress: onToggleDarkMode,
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
        onPress: onLogout,
      },
    ],
    [
      notificationsEnabled,
      darkModeEnabled,
      handleNavigation,
      onToggleNotification,
      onToggleDarkMode,
      onLogout,
    ],
  );

  return { menuItems };
};