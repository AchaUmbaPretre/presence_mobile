import { useState, useCallback } from 'react';
import { HistoryFilters } from '../types/history.types';

export const useHistoryFilters = () => {
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [tempFilters, setTempFilters] = useState<HistoryFilters>({});

  const updateTempFilter = useCallback((key: keyof HistoryFilters, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const applyTempFilters = useCallback(() => {
    setFilters(tempFilters);
  }, [tempFilters]);

  const resetTempFilters = useCallback(() => {
    setTempFilters(filters);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setTempFilters({});
  }, []);

  return {
    filters,
    tempFilters,
    setTempFilters,
    updateTempFilter,
    applyTempFilters,
    resetTempFilters,
    clearFilters,
  };
};