import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { HistoryItems, HistoryFilters, HistoryStats } from '../types/history.types';
import { MOCK_HISTORY, MOCK_STATS, HISTORY_MESSAGES } from '../constants/history.constants';
import * as Haptics from 'expo-haptics';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItems[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItems[]>([]);
  const [stats, setStats] = useState<HistoryStats>(MOCK_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HistoryFilters>({
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const userId = user?.id || 1; // Fallback pour développement

  const loadHistory = useCallback(async (showLoading = true) => {
    if (!userId) return;
    
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      // En développement, utiliser les données mockées
      // const data = await historyService.getHistory(userId, filters);
      const data = MOCK_HISTORY; // Remplacer par l'appel API réel
      
      setHistory(data);
      applyFilters(data, filters);
      
      // Charger les stats
      // const statsData = await historyService.getHistoryStats(userId);
      // setStats(statsData);
    } catch (err) {
      setError(HISTORY_MESSAGES.error);
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, filters]);

  const applyFilters = useCallback((data: HistoryItems[], currentFilters: HistoryFilters) => {
    let filtered = [...data];

    // Filtre par date
    if (currentFilters.startDate) {
      filtered = filtered.filter(item => item.date >= currentFilters.startDate!);
    }
    if (currentFilters.endDate) {
      filtered = filtered.filter(item => item.date <= currentFilters.endDate!);
    }

    // Filtre par statut
    if (currentFilters.status && currentFilters.status.length > 0) {
      filtered = filtered.filter(item => 
        currentFilters.status?.includes(item.statut)
      );
    }

    // Filtre par recherche
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.site?.toLowerCase().includes(searchLower) ||
        item.statut.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    if (currentFilters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (currentFilters.sortBy) {
          case 'date':
            comparison = a.date.localeCompare(b.date);
            break;
          case 'retard':
            comparison = a.retard_minutes - b.retard_minutes;
            break;
          case 'heures_supp':
            comparison = a.heures_supplementaires - b.heures_supplementaires;
            break;
        }
        return currentFilters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    setFilteredHistory(filtered);
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadHistory(false);
  }, [loadHistory]);

  const updateFilters = useCallback((newFilters: Partial<HistoryFilters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      applyFilters(history, updated);
      return updated;
    });
  }, [history, applyFilters]);

  const resetFilters = useCallback(() => {
    const defaultFilters: HistoryFilters = {
      sortBy: 'date',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    applyFilters(history, defaultFilters);
    Haptics.selectionAsync();
  }, [history, applyFilters]);

  const exportHistory = useCallback(async (format: 'pdf' | 'excel' = 'pdf') => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('Export', HISTORY_MESSAGES.export);
      
      // await historyService.exportHistory(userId, format);
      
      setTimeout(() => {
        Alert.alert('Succès', HISTORY_MESSAGES.exportSuccess);
      }, 1500);
    } catch (err) {
      Alert.alert('Erreur', HISTORY_MESSAGES.exportError);
    }
  }, [userId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history: filteredHistory,
    allHistory: history,
    stats,
    isLoading,
    isRefreshing,
    error,
    filters,
    showFilters,
    setShowFilters,
    refresh,
    updateFilters,
    resetFilters,
    exportHistory,
  };
};