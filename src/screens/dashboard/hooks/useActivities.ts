import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { getActivityListe } from "../services/activityService";
import { ActivityItem } from "../types/presence.types";

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
          console.log(`✅ ${response.data.length} activités chargées`);
        } else {
          setActivities([]);
          if (response.data.length === 0) {
            console.log("ℹ️ Aucune activité trouvée");
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
    console.log("Activité pressée:", activity.id);
    // Navigation vers le détail de l'activité
  }, []);

  const handleSeeAll = useCallback(() => {
    Haptics.selectionAsync();
    console.log("Voir toutes les activités");
    // Navigation vers l'écran d'historique
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
