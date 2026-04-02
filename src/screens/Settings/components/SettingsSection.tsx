import { NotificationSettings } from "@/screens/notification/components/NotificationSettings";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../../dashboard/constants/color";
import { SettingSection as SettingSectionType } from "../types/settings.types";
import { SettingsItem } from "./SettingsItem";

interface SettingsSectionProps {
  section: SettingSectionType;
  index: number;
  toggleValues: {
    notificationsEnabled: boolean;
    darkModeEnabled: boolean;
    biometricsEnabled: boolean;
    autoSyncEnabled: boolean;
  };
  onToggle: (id: string) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  section,
  index,
  toggleValues,
  onToggle,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 100).springify()}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item) => {
          // ✅ Si l'item est de type "custom" et concerne les notifications
          if (
            item.type === "custom" &&
            item.component === "NotificationSettings"
          ) {
            return (
              <View key={item.id} style={styles.customItemContainer}>
                <View style={styles.customItemHeader}>
                  <View style={styles.customItemIcon}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.gray[600]}
                    />
                  </View>
                  <Text style={styles.customItemLabel}>{item.label}</Text>
                </View>
                <NotificationSettings />
              </View>
            );
          }

          return (
            <SettingsItem
              key={item.id}
              item={item}
              toggleValues={toggleValues}
              onToggle={onToggle}
            />
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  customItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  customItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  customItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.gray[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  customItemLabel: {
    fontSize: 15,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
  },
});
