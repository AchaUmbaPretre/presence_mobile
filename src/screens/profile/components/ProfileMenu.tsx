import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { COLORS } from "../../dashboard/constants/color";
import { MenuItem } from "../types/profile.types";
import { ProfileMenuItem } from "./ProfileMenuItem";

interface ProfileMenuProps {
  items: MenuItem[];
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  onToggle: (item: MenuItem) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  items,
  notificationsEnabled,
  darkModeEnabled,
  onToggle,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(200).springify()}
      style={styles.container}
    >
      <View style={styles.menu}>
        {items.map((item, index) => (
          <ProfileMenuItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
            notificationsEnabled={notificationsEnabled}
            darkModeEnabled={darkModeEnabled}
            onToggle={onToggle}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  menu: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
  },
});
