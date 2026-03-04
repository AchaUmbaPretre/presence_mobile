import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/color";

interface HeaderProps {
  userName?: string;
}

export const Header = memo(({ userName = "Utilisateur" }: HeaderProps) => {
  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Gestion des présences</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileBadge}>
          <Text style={styles.profileInitials}>{initials}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: COLORS.gray[900],
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
  },
  profileContainer: {
    position: "relative",
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  profileInitials: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.primary.main,
  },
});
