import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../../dashboard/constants/color";
import { MenuItem } from "../types/profile.types";

interface ProfileMenuItemProps {
  item: MenuItem;
  isLast: boolean;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  onToggle: (item: MenuItem) => void;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  item,
  isLast,
  notificationsEnabled,
  darkModeEnabled,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        item.destructive && styles.destructive,
        isLast && styles.last,
      ]}
      onPress={() => {
        if (item.type === "toggle") {
          onToggle(item);
        } else {
          item.onPress?.();
        }
      }}
      disabled={item.type === "info"}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            item.destructive && styles.iconDestructive,
          ]}
        >
          <Ionicons
            name={item.icon}
            size={20}
            color={item.destructive ? COLORS.error.main : COLORS.gray[600]}
          />
        </View>
        <Text
          style={[styles.label, item.destructive && styles.labelDestructive]}
        >
          {item.label}
        </Text>
      </View>

      <View style={styles.right}>
        {item.value && <Text style={styles.value}>{item.value}</Text>}
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        {item.type === "toggle" ? (
          <Switch
            value={
              item.id === "notifications"
                ? notificationsEnabled
                : darkModeEnabled
            }
            onValueChange={() => onToggle(item)}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary.main }}
            thumbColor={COLORS.white}
            ios_backgroundColor={COLORS.gray[300]}
          />
        ) : item.type !== "info" ? (
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  last: {
    borderBottomWidth: 0,
  },
  destructive: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    marginTop: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.gray[50],
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconDestructive: {
    backgroundColor: `${COLORS.error.main}12`,
  },
  label: {
    fontSize: 15,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
    flex: 1,
  },
  labelDestructive: {
    color: COLORS.error.main,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginRight: 8,
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
});
