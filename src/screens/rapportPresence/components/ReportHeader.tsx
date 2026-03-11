import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ReportHeaderProps } from "../types/report.types";

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onExport,
  onShare,
}) => {
  return (
    <LinearGradient
      colors={[COLORS.primary.main, COLORS.primary.dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {Platform.OS === "ios" && (
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      )}

      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.actions}>
          {onExport && (
            <TouchableOpacity onPress={onExport} style={styles.actionButton}>
              <Ionicons
                name="download-outline"
                size={22}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )}
          {onShare && (
            <TouchableOpacity onPress={onShare} style={styles.actionButton}>
              <Ionicons name="share-outline" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "ios" ? 30 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: getFontFamily("bold"),
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.white + "CC",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
  },
});
