import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { getFontFamily } from "../../../constants/typography";
import { COLORS } from "../../dashboard/constants/color";
import { User } from "../types/profile.types";

interface ProfileHeaderProps {
  user: User;
  animatedStyle: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  animatedStyle,
}) => {
  return (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[styles.container, animatedStyle]}
    >
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={[COLORS.primary.light, COLORS.primary.main]}
          style={styles.avatarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </LinearGradient>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="camera" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>

      <View style={styles.roleBadge}>
        <Ionicons
          name="briefcase-outline"
          size={14}
          color={COLORS.primary.main}
        />
        <Text style={styles.roleText}>{user.role}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userName: {
    fontSize: 24,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.primary.main,
    marginLeft: 6,
  },
});
