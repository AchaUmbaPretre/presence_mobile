import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { historyService } from "../services/historyService";
import { HistoryFilters, HistoryItems } from "../types/history.types";

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItems[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false); // ← AJOUTÉ
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
          const siteName = item.site?.name || "";
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
      if (!userId) return;

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const response = await historyService.getHistory(userId, filters);

        setHistory(response.historique);
        setStats(response.stats);
        setPagination(response.pagination);
      } catch (err) {
        setError("Erreur lors du chargement de l'historique");
        console.error(err);
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
    if (pagination.page < pagination.pages && !isLoading) {
      setFilters((prev) => ({ ...prev, page: prev.page! + 1 }));
    }
  }, [pagination.page, pagination.pages, isLoading]);

  const updateFilters = useCallback((newFilters: Partial<HistoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    Haptics.selectionAsync();
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "date",
      sortOrder: "desc",
    });
    Haptics.selectionAsync();
  }, []);

  const exportHistory = useCallback(async () => {
    try {
      if (!userId) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await historyService.exportHistory(userId);
      // Optionnel: Afficher un message de succès
    } catch (err) {
      console.error("Erreur export:", err);
    }
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    stats,
    pagination,
    isLoading,
    isRefreshing,
    error,
    filters,
    showFilters, // ← AJOUTÉ
    setShowFilters, // ← AJOUTÉ
    refresh,
    loadMore,
    updateFilters,
    resetFilters,
    exportHistory, // ← AJOUTÉ
  };
};
