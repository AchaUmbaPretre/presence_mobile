import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LocationStatus } from '../types/geoloc.types';
import { ZONE_COLORS } from '../constants/geoloc.constants';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

interface ZoneIndicatorProps {
  status: LocationStatus;
  maxDistance?: number;
}

export const ZoneIndicator: React.FC<ZoneIndicatorProps> = ({
  status,
  maxDistance = 200,
}) => {
  const progress = Math.min(status.distance / maxDistance, 1);
  const percentage = Math.min(100 - (status.distance / maxDistance) * 100, 100);

  const getProgressColor = () => {
    if (status.isWithinZone) return ZONE_COLORS.authorized;
    if (status.distance > maxDistance) return ZONE_COLORS.forbidden;
    return ZONE_COLORS.warning;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Distance de la zone</Text>
        <Text style={styles.value}>{percentage.toFixed(0)}%</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={[ZONE_COLORS.authorized, ZONE_COLORS.warning, ZONE_COLORS.forbidden]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${percentage}%` }]}
          />
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: ZONE_COLORS.authorized }]} />
          <Text style={styles.legendText}>Dans la zone</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: ZONE_COLORS.warning }]} />
          <Text style={styles.legendText}>Proche</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: ZONE_COLORS.forbidden }]} />
          <Text style={styles.legendText}>Hors zone</Text>
        </View>
      </View>

      {!status.isWithinZone && (
        <View style={styles.hintContainer}>
          <Ionicons name="navigate" size={16} color={COLORS.primary.main} />
          <Text style={styles.hintText}>
            Rapprochez-vous de la zone autorisée
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[700],
  },
  value: {
    fontSize: 16,
    fontFamily: getFontFamily('bold'),
    color: COLORS.primary.main,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[600],
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  hintText: {
    fontSize: 12,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[600],
  },
});