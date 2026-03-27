import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import {
  getHebdomadaireById,
  getPresenceByUserId,
} from "../services/presenceService";
import { PresenceState } from "../types/presence.types";

interface PresenceApiResponse {
  data: {
    data: {
      id_presence?: number;
      date_presence?: string;
      heure_entree: string | null;
      heure_sortie: string | null;
      retard_minutes: number;
      heures_supplementaires: number;
      statut_jour?: string;
      site_id?: number;
      site_name?: string;
    };
    success: boolean;
  };
}

interface HebdomadaireApiResponse {
  data: {
    retard: number;
    supplementaires: number;
    objectif: number;
    objectifAtteint: number;
  };
}

interface HebdomadaireMetrics {
  retard: number;
  supplementaires: number;
  objectif: number;
  objectifAtteint: number;
}

export const usePresence = () => {
  const [presence, setPresence] = useState<PresenceState>({
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
  });

  const [metrics, setMetrics] = useState<HebdomadaireMetrics>({
    retard: 0,
    supplementaires: 0,
    objectif: 35,
    objectifAtteint: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const loadPresenceData = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setIsLoading(true);
      const response = (await getPresenceByUserId(currentUser.id)) as PresenceApiResponse;
      
      const apiData = response?.data?.data;
            
      if (apiData) {
        setPresence({
          heure_entree: apiData.heure_entree ?? null,
          heure_sortie: apiData.heure_sortie ?? null,
          retard_minutes: apiData.retard_minutes ?? 0,
          heures_supplementaires: apiData.heures_supplementaires ?? 0,
        });

      } else {
        setPresence({
          heure_entree: null,
          heure_sortie: null,
          retard_minutes: 0,
          heures_supplementaires: 0,
        });
      }
    } catch (err) {
      console.error("Erreur chargement présence:", err);
      setError("Impossible de charger les données de présence");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  const loadHebdomadaire = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setIsLoadingMetrics(true);
      const response = (await getHebdomadaireById({
        id: currentUser.id,
      })) as HebdomadaireApiResponse;

      const apiData = response?.data;
            
      if (apiData) {
        setMetrics({
          retard: apiData.retard ?? 0,
          supplementaires: apiData.supplementaires ?? 0,
          objectif: apiData.objectif ?? 35,
          objectifAtteint: apiData.objectifAtteint ?? 0,
        });
      }
    } catch (err) {
      console.error("Erreur chargement hebdomadaire:", err);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [currentUser?.id]);

  const refreshData = useCallback(() => {
    return Promise.all([loadPresenceData(), loadHebdomadaire()]);
  }, [loadPresenceData, loadHebdomadaire]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleMetricPress = useCallback(
    (metric: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      switch (metric) {
        case "retard":
          Alert.alert(
            "Détail des retards",
            `Total cumulé : ${metrics.retard} minutes`,
          );
          break;
        case "supplementaires":
          Alert.alert(
            "Heures supplémentaires",
            `${metrics.supplementaires}h effectuées`,
          );
          break;
        case "objectif":
          const reste = Math.max(0, metrics.objectif - metrics.objectifAtteint);
          Alert.alert(
            "Objectif hebdomadaire",
            `${metrics.objectifAtteint}h / ${metrics.objectif}h atteints\n` +
              `Reste : ${reste}h à effectuer`,
          );
          break;
      }
    },
    [metrics],
  );

  return {
    presence,
    metrics,
    isLoading,
    isLoadingMetrics,
    error,
    refreshData,
    handleMetricPress,
  };
};