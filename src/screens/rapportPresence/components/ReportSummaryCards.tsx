import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ReportSummaryCardsProps } from '../types/report.types';
import { REPORT_SUMMARY_CONFIG } from '../constants/report.constants';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

const SummaryCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
  label: string;
  color: string;
  lightColor: string;
}> = ({ icon, value, label, color, lightColor }) => (
  <LinearGradient
    colors={[lightColor, COLORS.white]}
    style={styles.card}
  >
    <View style={[styles.cardIcon, { backgroundColor: lightColor }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.cardContent}>
      <Text style={[styles.cardValue, { color }]}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  </LinearGradient>
);

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({
  summary,
}) => {
  const formatHours = (hours: number) => hours.toFixed(1) + 'h';

  const cards = [
    {
      ...REPORT_SUMMARY_CONFIG[0],
      value: summary.total_presences,
    },
    {
      ...REPORT_SUMMARY_CONFIG[1],
      value: summary.total_absences,
    },
    {
      ...REPORT_SUMMARY_CONFIG[2],
      value: summary.total_retards,
    },
    {
      ...REPORT_SUMMARY_CONFIG[3],
      value: formatHours(summary.total_heures_supp),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {cards.slice(0, 2).map((card, index) => (
          <SummaryCard key={index} {...card} />
        ))}
      </View>
      <View style={styles.row}>
        {cards.slice(2, 4).map((card, index) => (
          <SummaryCard key={index + 2} {...card} />
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
    flexDirection: 'row',
    gap: 8,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
    backgroundColor: COLORS.white,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  cardValue: {
    fontSize: 18,
    fontFamily: getFontFamily('bold'),
    lineHeight: 22,
  },
  cardLabel: {
    fontSize: 11,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
  },
});