import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HistoryStatsProps } from "../types/history.types";

const StatBlock: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color: string;
  bgColor: string;
}> = ({ icon, value, label, color, bgColor }) => (
  <View style={styles.statBlock}>
    <View style={[styles.statIconRing, { borderColor: bgColor }]}>
      <View style={[styles.statIconInner, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
    </View>
    <View style={styles.statContent}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

export const HistoryStats: React.FC<HistoryStatsProps> = ({
  stats,
  period = "Ce mois",
}) => {
  const formatHours = (hours: number) => hours.toFixed(1) + "h";
  const totalDays = stats.total_jours || 1;
  const presenceRate = Math.round((stats.total_presents / totalDays) * 100);

  const mainStats = [
    {
      id: "presence",
      icon: "checkmark-circle" as const,
      value: stats.total_presents,
      label: "Présents",
      color: COLORS.success.main,
      bgColor: COLORS.success.light,
    },
    {
      id: "absence",
      icon: "close-circle" as const,
      value: stats.total_absents,
      label: "Absents",
      color: COLORS.error.main,
      bgColor: COLORS.error.light,
    },
    {
      id: "retard",
      icon: "time" as const,
      value: stats.total_retards,
      label: "Retards",
      color: COLORS.warning.main,
      bgColor: COLORS.warning.light,
    },
    {
      id: "heures-sup",
      icon: "trending-up" as const,
      value: formatHours(stats.total_heures_supp),
      label: "Heures sup",
      color: COLORS.primary.main,
      bgColor: COLORS.primary.light,
    },
  ];

  const secondaryStats = [
    {
      id: "non-travaille",
      icon: "calendar-outline" as const,
      value: stats.total_non_travailles || 0,
      label: "Non travaillés",
      color: COLORS.gray[600],
    },
    {
      id: "ferie",
      icon: "gift-outline" as const,
      value: stats.total_feries || 0,
      label: "Fériés",
      color: COLORS.warning.dark,
    },
    {
      id: "justifie",
      icon: "document-text-outline" as const,
      value: stats.total_justifies || 0,
      label: "Justifiés",
      color: COLORS.primary.main,
    },
  ];

  const metrics = [
    {
      id: "retard-total",
      icon: "timer-outline" as const,
      value: `${stats.total_retard_minutes}min`,
      label: "Retard total",
    },
    {
      id: "moyenne",
      icon: "trending-up" as const,
      value: formatHours(stats.moyenne_heures),
      label: "Moyenne",
    },
    {
      id: "objectif",
      icon: "flag" as const,
      value: `${Math.round((stats.objectif_atteint / stats.objectif_hebdo) * 100)}%`,
      label: "Objectif",
    },
  ];

  return (
    <View style={styles.card}>
      {/* Header avec signature */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.headerBadge}>
            <Text style={styles.period}>{period}</Text>
          </View>
          <View style={styles.headerStats}>
            <Ionicons name="calendar" size={12} color={COLORS.gray[400]} />
            <Text style={styles.totalJours}>{stats.total_jours} jours</Text>
          </View>
        </View>

        <LinearGradient
          colors={[COLORS.success.light, COLORS.success.main]}
          style={styles.ratePill}
        >
          <Text style={styles.rateText}>{presenceRate}%</Text>
        </LinearGradient>
      </View>

      {/* Grille principale - 2x2 */}
      <View style={styles.mainGrid}>
        {mainStats.map((stat) => (
          <StatBlock key={stat.id} {...stat} />
        ))}
      </View>

      {/* Ligne de séparation signature */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerDot} />
        <View style={styles.dividerLine} />
        <View style={styles.dividerDot} />
      </View>

      {/* Stats secondaires - disposition asymétrique */}
      <View style={styles.secondaryGrid}>
        {secondaryStats.map((stat) => (
          <View key={stat.id} style={styles.secondaryItem}>
            <View
              style={[
                styles.secondaryIcon,
                { backgroundColor: `${stat.color}15` },
              ]}
            >
              <Ionicons name={stat.icon} size={12} color={stat.color} />
            </View>
            <Text style={[styles.secondaryValue, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.secondaryLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Métriques avec style unique */}
      <View style={styles.metricsContainer}>
        {metrics.map((metric, index) => (
          <React.Fragment key={metric.id}>
            <View style={styles.metricItem}>
              <Ionicons name={metric.icon} size={12} color={COLORS.gray[400]} />
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
            {index < metrics.length - 1 && (
              <View style={styles.metricDivider} />
            )}
          </React.Fragment>
        ))}
      </View>

      <View style={styles.signature}>
        <View style={styles.signatureDot} />
        <View style={styles.signatureDot} />
        <View style={styles.signatureDot} />
      </View>
    </View>
  );
};

// ==================== STYLES UNIQUES ====================
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerBadge: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  period: {
    fontSize: 12,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[700],
  },
  headerStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  totalJours: {
    fontSize: 10,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
  },
  ratePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    minWidth: 50,
    alignItems: "center",
  },
  rateText: {
    fontSize: 13,
    fontFamily: getFontFamily("bold"),
    color: COLORS.white,
  },
  mainGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  statBlock: {
    width: "25%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingRight: 8,
  },
  statIconRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: COLORS.success.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statIconInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontFamily: getFontFamily("bold"),
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 8,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
    lineHeight: 12,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary.main,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 6,
  },
  secondaryGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 14,
  },
  secondaryItem: {
    alignItems: "center",
    flex: 1,
  },
  secondaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  secondaryValue: {
    fontSize: 13,
    fontFamily: getFontFamily("bold"),
    marginBottom: 2,
  },
  secondaryLabel: {
    fontSize: 9,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  metricsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray[50],
    borderRadius: 20,
    padding: 8,
  },
  metricItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  metricValue: {
    fontSize: 11,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[700],
  },
  metricLabel: {
    fontSize: 9,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.gray[200],
  },
  signature: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
  },
  signatureDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.gray[300],
  },
});
