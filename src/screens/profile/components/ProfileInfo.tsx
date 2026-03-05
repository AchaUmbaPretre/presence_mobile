import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../../dashboard/constants/color";
import { User } from "../types/profile.types";

interface ProfileInfoProps {
  user: User;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(150).springify()}
      style={styles.container}
    >
      <View style={styles.row}>
        <Ionicons name="business-outline" size={18} color={COLORS.gray[500]} />
        <Text style={styles.label}>Département</Text>
        <Text style={styles.value}>{user.department}</Text>
      </View>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={18} color={COLORS.gray[500]} />
        <Text style={styles.label}>Membre depuis</Text>
        <Text style={styles.value}>{user.joinDate}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    marginLeft: 12,
  },
  value: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[900],
  },
});
