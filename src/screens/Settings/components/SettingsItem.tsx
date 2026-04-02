import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../dashboard/constants/color";
import { getFontFamily } from "../../../constants/typography";
import { SettingItem as SettingItemType } from "../types/settings.types";

interface SettingsItemProps {
  item: SettingItemType;
  toggleValues: {
    notificationsEnabled: boolean;
    darkModeEnabled: boolean;
    biometricsEnabled: boolean;
    autoSyncEnabled: boolean;
  };
  onToggle: (id: string) => void;
  onPress?: () => void; // ✅ Ajout de la prop optionnelle
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  item,
  toggleValues,
  onToggle,
  onPress, // ✅ Ajout
}) => {
  const getToggleValue = () => {
    switch (item.id) {
      case "notifications": return toggleValues.notificationsEnabled;
      case "darkmode": return toggleValues.darkModeEnabled;
      case "biometrics": return toggleValues.biometricsEnabled;
      case "autosync": return toggleValues.autoSyncEnabled;
      default: return false;
    }
  };

  const handlePress = () => {
    if (item.disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // ✅ Si onPress personnalisé est fourni, l'utiliser
    if (onPress) {
      onPress();
    } 
    // Sinon, comportement normal
    else if (item.type === "toggle") {
      onToggle(item.id);
    } 
    else {
      item.onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.item, item.disabled && styles.itemDisabled]}
      onPress={handlePress}
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
            value={getToggleValue()}
            onValueChange={() => onToggle(item.id)}
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
};

const styles = StyleSheet.create({
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
    backgroundColor: `${COLORS.error.main}12`,
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
});