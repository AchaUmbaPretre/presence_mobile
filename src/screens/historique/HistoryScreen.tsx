import { COLORS } from "@/screens/dashboard/constants/color";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { useHistory } from "./hooks/useHistory";
import { HistoryHeader } from "./components/HistoryHeader";
import { HistoryStats } from "./components/HistoryStats";
import { HistoryList } from "./components/HistoryList";
import { HistoryFilters } from "./components/HistoryFilters";


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
  } = useHistory();

  const handleItemPress = (item: any) => {
    // Naviguer vers les détails de l'historique
    console.log("Item pressé:", item.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary.main}
      />

      <HistoryHeader
        title="Historique"
        subtitle="Vos présences"
        onBack={() => navigation.goBack()}
        onFilter={() => setShowFilters(true)}
        onExport={() => exportHistory()}
      />

      <View style={styles.content}>
        <HistoryStats stats={stats} period="30 derniers jours" />

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
        onApply={() => setShowFilters(false)}
        onReset={resetFilters}
        visible={showFilters}
        onClose={() => setShowFilters(false)}
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
});

export default HistoryScreen;
