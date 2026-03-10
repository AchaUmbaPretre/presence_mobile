import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HistoryHeaderProps } from '../types/history.types';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onFilter,
  onExport,
}) => {
  return (
    <LinearGradient
      colors={[COLORS.primary.main, COLORS.primary.dark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
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
          {onFilter && (
            <TouchableOpacity onPress={onFilter} style={styles.actionButton}>
              <Ionicons name="filter" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
          {onExport && (
            <TouchableOpacity onPress={onExport} style={styles.actionButton}>
              <Ionicons name="download" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: getFontFamily('bold'),
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.white + 'CC',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
  },
});