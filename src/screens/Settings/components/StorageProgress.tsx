import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { COLORS } from "../../dashboard/constants/color";
import { getFontFamily } from "../../../constants/typography";
import { STORAGE_INFO } from "../constants/settings.constants";

export const StorageProgress: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Stockage utilisé</Text>
        <Text style={styles.value}>
          {STORAGE_INFO.used} GB / {STORAGE_INFO.total} GB
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${STORAGE_INFO.percentage}%` },
          ]}
        />
      </View>
    </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[700],
  },
  value: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary.main,
    borderRadius: 4,
  },
});