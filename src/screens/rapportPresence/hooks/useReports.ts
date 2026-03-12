import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { REPORT_MESSAGES } from "../constants/report.constants";
import { reportService } from "../services/reportService";
import {
    ReportFilters,
    ReportFormat,
    ReportStats,
} from "../types/report.types";

export const useReports = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({
    period: "month",
  });

  const loadReport = useCallback(
    async (showLoading = true) => {
      if (!filters.userId) {
        setError("Utilisateur non identifié");
        return;
      }

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const data = await reportService.getReportStats(filters);

        if (data) {
          setStats(data);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          throw new Error("Données invalides");
        }
      } catch (err) {
        setError(REPORT_MESSAGES.error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        console.error("❌ Erreur chargement rapport:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filters],
  );

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadReport(false);
  }, [loadReport]);

  const updateFilters = useCallback((newFilters: Partial<ReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    Haptics.selectionAsync();
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ period: "month" });
    Haptics.selectionAsync();
    loadReport();
  }, [loadReport]);

  const exportReport = useCallback(
    async (format: ReportFormat) => {
      try {
        if (!filters.userId) {
          Alert.alert("Erreur", "Utilisateur non identifié");
          return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const message = await reportService.exportReport(filters, format);
        Alert.alert("Succès", message);
      } catch (err) {
        Alert.alert("Erreur", REPORT_MESSAGES.exportError);
        console.error("❌ Erreur export rapport:", err);
      }
    },
    [filters],
  );

  const shareReport = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!stats) {
      Alert.alert("Erreur", "Aucune donnée à partager");
      return;
    }

    Alert.alert("Partage", "Fonctionnalité à venir");
  }, [stats]);

  useEffect(() => {
    loadReport();
  }, [filters.period, filters.startDate, filters.endDate, filters.userId]);

  return {
    stats,
    isLoading,
    isRefreshing,
    error,
    filters,

    refresh,
    updateFilters,
    resetFilters,
    exportReport,
    shareReport,
  };
};
