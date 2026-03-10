import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HISTORY_MESSAGES } from "../constants/history.constants";
import { HistoryEmptyProps } from "../types/history.types";

export const HistoryEmpty: React.FC<HistoryEmptyProps> = ({
  message = HISTORY_MESSAGES.empty,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gray[50], COLORS.white]}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="document-text-outline"
            size={60}
            color={COLORS.gray[300]}
          />
        </View>

        <Text style={styles.title}>Aucun historique</Text>
        <Text style={styles.message}>{message}</Text>

        {onRefresh && (
          <TouchableOpacity style={styles.button} onPress={onRefresh}>
            <LinearGradient
              colors={[COLORS.primary.light, COLORS.primary.main]}
              style={styles.buttonGradient}
            >
              <Ionicons name="refresh" size={18} color={COLORS.white} />
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
    minHeight: 400,
  },
  gradient: {
    alignItems: "center",
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    width: "100%",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.white,
  },
});
