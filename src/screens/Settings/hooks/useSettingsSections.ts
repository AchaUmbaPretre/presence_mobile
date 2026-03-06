import { useMemo } from "react";
import {
    APP_VERSION,
    BUILD_NUMBER,
    STORAGE_INFO,
    supportsBiometrics,
} from "../constants/settings.constants";
import { SettingSection, SettingsState } from "../types/settings.types";

interface UseSettingsSectionsProps {
  state: SettingsState;
  handlers: any;
}

export const useSettingsSections = ({
  state,
  handlers,
}: UseSettingsSectionsProps) => {
  const sections: SettingSection[] = useMemo(
    () => [
      {
        id: "preferences",
        title: "Préférences",
        items: [
          {
            id: "notifications",
            icon: "notifications-outline",
            label: "Notifications",
            value: state.notificationsEnabled ? "Activées" : "Désactivées",
            type: "toggle",
          },
          {
            id: "darkmode",
            icon: "moon-outline",
            label: "Mode sombre",
            value: state.darkModeEnabled ? "Activé" : "Désactivé",
            type: "toggle",
          },
          {
            id: "biometrics",
            icon: "finger-print-outline",
            label: "Authentification biométrique",
            value: state.biometricsEnabled ? "Activée" : "Désactivée",
            type: "toggle",
            disabled: !supportsBiometrics,
          },
          {
            id: "language",
            icon: "language-outline",
            label: "Langue",
            value: state.language,
            type: "navigation",
            onPress: handlers.handleLanguageSelect,
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
            value: state.autoSyncEnabled ? "Activée" : "Désactivée",
            type: "toggle",
          },
          {
            id: "cache",
            icon: "folder-outline",
            label: "Cache",
            value: state.cacheSize,
            type: "navigation",
            onPress: handlers.handleClearCache,
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
            onPress: handlers.handleExportData,
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
            onPress: () =>
              handlers.handleOpenLink("https://example.com/privacy"),
          },
          {
            id: "terms",
            icon: "document-text-outline",
            label: "Conditions d'utilisation",
            type: "navigation",
            onPress: () => handlers.handleOpenLink("https://example.com/terms"),
          },
          {
            id: "data-deletion",
            icon: "trash-outline",
            label: "Supprimer mon compte",
            type: "action",
            destructive: true,
            onPress: handlers.handleDeleteAccount,
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
            onPress: handlers.handleCheckUpdates,
          },
          {
            id: "rate",
            icon: "star-outline",
            label: "Noter l'application",
            type: "navigation",
            onPress: handlers.handleRateApp,
          },
          {
            id: "share",
            icon: "share-social-outline",
            label: "Partager l'application",
            type: "navigation",
            onPress: handlers.handleShareApp,
          },
          {
            id: "contact",
            icon: "mail-outline",
            label: "Nous contacter",
            type: "navigation",
            onPress: handlers.handleContact,
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
            onPress: handlers.handleResetSettings,
          },
          {
            id: "logout",
            icon: "log-out-outline",
            label: "Déconnexion",
            type: "action",
            destructive: true,
            onPress: handlers.handleLogout,
          },
        ],
      },
    ],
    [state, handlers],
  );

  return { sections };
};