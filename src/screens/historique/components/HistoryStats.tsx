import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { HistoryStatsProps } from '../types/history.types';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

export const HistoryStats: React.FC<HistoryStatsProps> = ({
  stats,
  period = 'Ce mois',
}) => {
  const formatHours = (hours: number) => {
    return hours.toFixed(1) + 'h';
  };

  return (
    <LinearGradient
      colors={[COLORS.white, COLORS.gray[50]]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.period}>{period}</Text>
        <Text style={styles.totalJours}>{stats.total_jours} jours</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.success.light }]}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success.main} />
          </View>
          <Text style={styles.statValue}>{stats.total_presents}</Text>
          <Text style={styles.statLabel}>Présents</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.error.light }]}>
            <Ionicons name="close-circle" size={20} color={COLORS.error.main} />
          </View>
          <Text style={styles.statValue}>{stats.total_absents}</Text>
          <Text style={styles.statLabel}>Absents</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.warning.light }]}>
            <Ionicons name="time" size={20} color={COLORS.warning.main} />
          </View>
          <Text style={styles.statValue}>{stats.total_retards}</Text>
          <Text style={styles.statLabel}>Retards</Text>
        </View>

        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: COLORS.primary.light }]}>
            <Ionicons name="trending-up" size={20} color={COLORS.primary.main} />
          </View>
          <Text style={styles.statValue}>{formatHours(stats.total_heures)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.moyenne}>
          Moyenne: {formatHours(stats.moyenne_heures)} / jour
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  period: {
    fontSize: 16,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[900],
  },
  totalJours: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontFamily: getFontFamily('bold'),
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 12,
    alignItems: 'center',
  },
  moyenne: {
    fontSize: 14,
    fontFamily: getFontFamily('medium'),
    color: COLORS.primary.main,
  },
});