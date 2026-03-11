import React, { useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';
import { useReports } from './hooks/useReports';
import { ReportHeader } from './components/ReportHeader';
import { ReportEmpty } from './components/ReportEmpty';
import { ReportPeriodSelector } from './components/ReportPeriodSelector';
import { ReportSummaryCards } from './components/ReportSummaryCards';
import { ReportChart } from './components/ReportChart';
import { ReportStatsTable } from './components/ReportStatsTable';
import { ReportExportButton } from './components/ReportExportButton';

export const RapportPresenceScreen = () => {
  const navigation = useNavigation();
  const {
    stats,
    isLoading,
    isRefreshing,
    error,
    filters,
    refresh,
    updateFilters,
    exportReport,
    shareReport,
  } = useReports();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePeriodChange = useCallback((period: any) => {
    updateFilters({ period });
  }, [updateFilters]);

  const handleDateRangeChange = useCallback((start: string, end: string) => {
    updateFilters({ startDate: start, endDate: end });
  }, [updateFilters]);

  const handleExport = useCallback((format: any) => {
    exportReport(format);
  }, [exportReport]);

  if (isLoading && !isRefreshing && !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.main} />
        <ReportHeader title="Rapports" subtitle="Statistiques de présence" onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary.main} />
          <Text style={styles.loadingText}>Génération du rapport...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.main} />
        <ReportHeader title="Rapports" subtitle="Statistiques de présence" onBack={handleBack} />
        <ReportEmpty message={error} onRefresh={refresh} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.main} />

      <ReportHeader
        title="Rapports"
        subtitle="Statistiques de présence"
        onBack={handleBack}
        onExport={shareReport}
        onShare={shareReport}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        <ReportPeriodSelector
          period={filters.period}
          onPeriodChange={handlePeriodChange}
          onDateRangeChange={handleDateRangeChange}
          startDate={filters.startDate}
          endDate={filters.endDate}
        />

        {stats && (
          <>
            <ReportSummaryCards summary={stats.summary} />

            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Taux de présence</Text>
                  <Text style={styles.statValue}>{stats.summary.taux_presence}%</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Moyenne/jour</Text>
                  <Text style={styles.statValue}>
                    {stats.summary.moyenne_heures_jour.toFixed(1)}h
                  </Text>
                </View>
              </View>
            </View>

            <ReportChart data={stats.chartData} />

            <ReportStatsTable
              data={stats.tableData}
              onRowPress={(item) => console.log('Row pressed:', item)}
            />

            <View style={styles.exportContainer}>
              <ReportExportButton onExport={handleExport} />
              <Text style={styles.generatedAt}>
                Généré le {new Date(stats.generatedAt).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
  },
  statsContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: getFontFamily('bold'),
    color: COLORS.primary.main,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: 16,
  },
  exportContainer: {
    alignItems: 'center',
    marginVertical: 16,
    gap: 8,
  },
  generatedAt: {
    fontSize: 11,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[400],
  },
});

export default RapportPresenceScreen;