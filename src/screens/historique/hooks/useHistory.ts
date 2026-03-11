import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { historyService } from "../services/historyService";
import { HistoryFilters, HistoryItems, HistoryStats, HistoryResponse } from "../types/history.types";
import { Alert } from "react-native";

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItems[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters>({
    page: 1,
    limit: 20,
    sortBy: "date",
    sortOrder: "desc",
  });

  const user = useSelector((state: RootState) => state.auth.currentUser);
  const userId = user?.id;

  // ✅ Fonction de filtrage locale
  const applyClientFilters = useCallback(
    (items: HistoryItems[], currentFilters: HistoryFilters) => {
      let filtered = [...items];

      // Filtre par recherche
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        filtered = filtered.filter((item) => {
          // ✅ Correction: item.site est maintenant une string
          const siteName = item.site || "";
          const statut = item.statut.toLowerCase();

          return (
            siteName.toLowerCase().includes(searchLower) ||
            statut.includes(searchLower)
          );
        });
      }

      // Filtre par statut
      if (currentFilters.status && currentFilters.status.length > 0) {
        filtered = filtered.filter((item) =>
          currentFilters.status?.includes(item.statut),
        );
      }

      // Tri
      if (currentFilters.sortBy) {
        filtered.sort((a, b) => {
          let comparison = 0;
          switch (currentFilters.sortBy) {
            case "date":
              comparison = a.date.localeCompare(b.date);
              break;
            case "retard":
              comparison = a.retard_minutes - b.retard_minutes;
              break;
            case "heures_supp":
              comparison = a.heures_supplementaires - b.heures_supplementaires;
              break;
          }
          return currentFilters.sortOrder === "desc" ? -comparison : comparison;
        });
      }

      return filtered;
    },
    [],
  );

  const loadHistory = useCallback(
    async (showLoading = true) => {
      if (!userId) {
        setError("Utilisateur non identifié");
        return;
      }

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const response = await historyService.getHistory(userId, filters);

        setHistory(response.historique);
        setStats(response.stats);
        setPagination(response.pagination);
      } catch (err: any) {
        const errorMessage = err?.message || "Erreur lors du chargement de l'historique";
        setError(errorMessage);
        console.error("❌ Erreur chargement historique:", err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId, filters],
  );

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilters((prev) => ({ ...prev, page: 1 }));
    loadHistory(false);
  }, [loadHistory]);

  const loadMore = useCallback(() => {
    if (pagination.page < pagination.pages && !isLoading && !isRefreshing) {
      setFilters((prev) => ({ ...prev, page: prev.page! + 1 }));
    }
  }, [pagination.page, pagination.pages, isLoading, isRefreshing]);

  const updateFilters = useCallback((newFilters: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    Haptics.selectionAsync();
    // Optionnel: recharger automatiquement
    // loadHistory(true);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "date",
      sortOrder: "desc",
    });
    Haptics.selectionAsync();
    loadHistory(true);
  }, [loadHistory]);

  const exportHistory = useCallback(async () => {
    try {
      if (!userId) {
        Alert.alert("Erreur", "Utilisateur non identifié");
        return;
      }
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await historyService.exportHistory(userId);
      Alert.alert("Succès", "Historique exporté avec succès");
    } catch (err) {
      console.error("❌ Erreur export:", err);
      Alert.alert("Erreur", "Impossible d'exporter l'historique");
    }
  }, [userId]);

  const getItemById = useCallback((id: number) => {
    return history.find(item => item.id === id) || null;
  }, [history]);

  // Recharger quand les filtres changent
  useEffect(() => {
    loadHistory();
  }, [filters.page]); // ← Ne recharge que quand la page change
  // Pour recharger sur tous les filtres, utiliser [filters]

  return {
    // Données
    history,
    stats,
    pagination,
    
    // États
    isLoading,
    isRefreshing,
    error,
    filters,
    showFilters,
    
    // Actions
    setShowFilters,
    refresh,
    loadMore,
    updateFilters,
    resetFilters,
    exportHistory,
    getItemById,
  };
};