import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { REPORT_SUMMARY_CONFIG } from "../constants/report.constants";
import { ReportSummaryCardsProps } from "../types/report.types";

const SummaryCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color: string;
  lightColor: string;
  description?: string;
}> = ({ icon, value, label, color, lightColor, description }) => (
  <View style={styles.card}>
    <View style={[styles.cardIcon, { backgroundColor: lightColor }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.cardContent}>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
      {description && (
        <Text style={styles.cardDescription}>{description}</Text>
      )}
    </View>
  </View>
);

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({
  summary,
}) => {
  const formatHours = (hours?: number) => {
    if (hours === undefined || hours === null) return "0h";
    return hours.toFixed(1) + "h";
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "0";
    return num.toString();
  };

  const cards = [
    {
      ...REPORT_SUMMARY_CONFIG[0],
      value: formatNumber(summary?.total_presents),
      description: `${Math.round((summary?.total_presents / (summary?.total_jours || 1)) * 100)}% du temps`,
    },
    {
      ...REPORT_SUMMARY_CONFIG[1],
      value: formatNumber(summary?.total_absents),
      description: `${summary?.total_justifies || 0} justifiés`,
    },
    {
      ...REPORT_SUMMARY_CONFIG[2],
      value: formatNumber(summary?.total_retards),
      description: `Total: ${summary?.total_retard_minutes || 0} min`,
    },
    {
      ...REPORT_SUMMARY_CONFIG[3],
      value: formatHours(summary?.total_heures_supp),
      description: `Moy: ${summary?.moyenne_heures?.toFixed(1) || 0}h/jour`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {cards.slice(0, 2).map((card, index) => (
          <SummaryCard key={`card-${index}`} {...card} />
        ))}
      </View>
      <View style={styles.row}>
        {cards.slice(2, 4).map((card, index) => (
          <SummaryCard key={`card-${index + 2}`} {...card} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
    backgroundColor: COLORS.white,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: 20,
    fontFamily: getFontFamily("bold"),
    lineHeight: 24,
    marginBottom: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[700],
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 10,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
});