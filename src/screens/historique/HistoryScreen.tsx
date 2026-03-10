import { COLORS } from "@/screens/dashboard/constants/color";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useHistory } from "./hooks/useHistory";
import { HistoryHeader } from "./components/HistoryHeader";
import { HistoryStats } from "./components/HistoryStats";
import { HistoryList } from "./components/HistoryList";
import { HistoryFilters } from "./components/HistoryFilters";
import { HistoryItems } from "./types/history.types";
import { getFontFamily } from "@/constants/typography";

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const {
    history,
    stats,
    isLoading,
    isRefreshing,
    filters,
    showFilters,
    setShowFilters,
    refresh,
    updateFilters,
    resetFilters,
    exportHistory,
    error,
  } = useHistory();

  const handleItemPress = useCallback((item: HistoryItems) => {
    console.log("Item pressé:", item.id);
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    setShowFilters(true);
  }, [setShowFilters]);

  const handleExportPress = useCallback(() => {
    exportHistory();
  }, [exportHistory]);

  const handleApplyFilters = useCallback(() => {
    setShowFilters(false);
  }, [setShowFilters]);

  const handleCloseFilters = useCallback(() => {
    setShowFilters(false);
  }, [setShowFilters]);

  // État de chargement
  if (isLoading && !isRefreshing && history.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.main} />
        <HistoryHeader
          title="Historique"
          subtitle="Vos présences"
          onBack={handleBack}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary.main} />
          <Text style={styles.loadingText}>Chargement de l'historique...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // État d'erreur
  if (error && history.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.main} />
        <HistoryHeader
          title="Historique"
          subtitle="Vos présences"
          onBack={handleBack}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary.main} />

      <HistoryHeader
        title="Historique"
        subtitle="Vos présences"
        onBack={handleBack}
        onFilter={handleFilterPress}
        onExport={handleExportPress}
      />

      <View style={styles.content}>
        {stats && <HistoryStats stats={stats} period="30 derniers jours" />}

        <HistoryList
          items={history}
          onItemPress={handleItemPress}
          onRefresh={refresh}
          refreshing={isRefreshing}
        />
      </View>

      <HistoryFilters
        filters={filters}
        onFilterChange={updateFilters}
        onApply={handleApplyFilters}
        onReset={resetFilters}
        visible={showFilters}
        onClose={handleCloseFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[500],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.error.main,
    textAlign: "center",
  },
});

export default HistoryScreen;