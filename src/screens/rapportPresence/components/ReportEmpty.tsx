import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ReportEmptyProps } from "../types/report.types";

export const ReportEmpty: React.FC<ReportEmptyProps> = ({
  message = "Aucune donnée disponible",
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gray[50], COLORS.white]}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="bar-chart-outline"
            size={48}
            color={COLORS.gray[300]}
          />
        </View>
        <Text style={styles.title}>Aucun rapport</Text>
        <Text style={styles.message}>{message}</Text>
        {onRefresh && (
          <TouchableOpacity style={styles.button} onPress={onRefresh}>
            <LinearGradient
              colors={[COLORS.primary.light, COLORS.primary.main]}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh" size={16} color={COLORS.white} />
              <Text style={styles.buttonText}>Rafraîchir</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    width: "100%",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[800],
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.white,
  },
});
