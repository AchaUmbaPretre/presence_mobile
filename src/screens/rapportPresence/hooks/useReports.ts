import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { reportService } from '../services/reportService';
import { ReportFilters, ReportStats, ReportFormat } from '../types/report.types';
import { REPORT_MESSAGES } from '../constants/report.constants';

export const useReports = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    period: 'month',
  });

  const loadReport = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const data = await reportService.getReportStats(filters);
      setStats(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(REPORT_MESSAGES.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadReport(false);
  }, [loadReport]);

  const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    Haptics.selectionAsync();
  }, []);

  const exportReport = useCallback(async (format: ReportFormat) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const message = await reportService.exportReport(filters, format);
      Alert.alert('Succès', message);
    } catch (err) {
      Alert.alert('Erreur', REPORT_MESSAGES.exportError);
    }
  }, [filters]);

  const shareReport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Implémenter le partage
    Alert.alert('Partage', 'Fonctionnalité à venir');
  }, []);

  useEffect(() => {
    loadReport();
  }, [filters.period, filters.startDate, filters.endDate]);

  return {
    stats,
    isLoading,
    isRefreshing,
    error,
    filters,
    refresh,
    updateFilters,
    exportReport,
    shareReport,
  };
};