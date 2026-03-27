import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { getActivityListe } from "../services/activityService";
import { ActivityItem } from "../types/activity.types";

export const useActivities = (userId?: number) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(
    async (showLoading = true) => {
      if (!userId) {
        setActivities([]);
        return;
      }

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const response = await getActivityListe(userId);

        if (response.success) {
          setActivities(response.data);
        } else {
          setActivities([]);
          if (response.data.length === 0) {
          } else {
            throw new Error("Erreur de chargement");
          }
        }
      } catch (err) {
        setError("Impossible de charger les activités");
        console.error("❌ Erreur chargement activités:", err);
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  const refreshActivities = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    return loadActivities(false);
  }, [loadActivities]);

  const handleActivityPress = useCallback((activity: ActivityItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleSeeAll = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    isLoading,
    error,
    refreshActivities,
    handleActivityPress,
    handleSeeAll,
  };
};
