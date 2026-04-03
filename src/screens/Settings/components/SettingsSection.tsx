import { NotificationSettings } from "@/screens/notification/components/NotificationSettings";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  FadeOutUp,
  Layout 
} from "react-native-reanimated";
import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../../dashboard/constants/color";
import { SettingsSectionProps } from "../types/settings.types";
import { SettingsItem } from "./SettingsItem";


export const SettingsSection: React.FC<SettingsSectionProps> = ({
  section,
  index,
  toggleValues,
  onToggle,
}) => {
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 100).springify()}
      style={styles.section}
    >
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item) => {
          if (item.id === "notifications") {
            const modifiedItem = {
              ...item,
              value: showNotificationSettings ? "Masquer" : "Configurer",
            };
            
            return (
              <View key={item.id}>
                <SettingsItem
                  item={modifiedItem}
                  toggleValues={toggleValues}
                  onToggle={onToggle}
                  onPress={() => setShowNotificationSettings(!showNotificationSettings)}
                />
                {showNotificationSettings && (
                  <Animated.View
                    entering={FadeInUp.springify()}
                    exiting={FadeOutUp.springify()}
                    layout={Layout.springify()}
                    style={styles.notificationSettingsContainer}
                  >
                    <NotificationSettings />
                  </Animated.View>
                )}
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
  notificationSettingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    backgroundColor: COLORS.gray[50],
  },
});