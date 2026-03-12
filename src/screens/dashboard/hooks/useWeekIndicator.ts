import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { getSemainePresence } from "../services/weekService";
import { WeekDay } from "../types/weekIndication.type";

export const useWeekIndicator = (userId?: number) => {
  const [days, setDays] = useState<WeekDay[]>([]);
  const [stats, setStats] = useState({ present: 0, partial: 0, total: 7 });
  const [period, setPeriod] = useState({ debut: "", fin: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeekData = useCallback(async () => {
    if (!userId) {
      setDays([]);
      setStats({ present: 0, partial: 0, total: 7 });                         
      setPeriod({ debut: "", fin: "" });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getSemainePresence(userId);
      if (response?.success) {
        setDays(response.data?.jours || []);
        setStats(response.data?.stats || { present: 0, partial: 0, total: 7 });
        setPeriod(response.data?.periode || { debut: "", fin: "" });
      }
    } catch (err) {
      setError("Erreur de chargement");
      console.error("❌ Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    loadWeekData();
  }, [loadWeekData]);

  const handleDayPress = useCallback((day: WeekDay, index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`📅 Jour cliqué: ${day.letter} (${day.date})`);
  }, []);

  useEffect(() => {
    loadWeekData();
  }, [loadWeekData]);

  return {
    days,
    stats,
    period,
    isLoading,
    error,
    refresh,
    handleDayPress,
  };
};
