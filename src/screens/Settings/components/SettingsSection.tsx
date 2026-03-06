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
        {section.items.map((item) => (
          <SettingsItem
            key={item.id}
            item={item}
            toggleValues={toggleValues}
            onToggle={onToggle}
          />
        ))}
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
});
