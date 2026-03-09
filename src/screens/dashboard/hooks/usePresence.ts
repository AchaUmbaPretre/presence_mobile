import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { getHebdomadaireById, postPresence } from "../services/presenceService";
import {
  ActionType,
  PointageSource,
  PresenceState,
} from "../types/presence.types";
import * as Haptics from "expo-haptics";

const MESSAGES = {
  SUCCESS_TITLE: "✅ Pointage enregistré",
  ERROR_TITLE: "❌ Erreur",
  SERVER_ERROR: "Impossible de contacter le serveur",
  RETRY: "Réessayer",
  CLOSE: "Fermer",
  ALREADY_DONE: "⏰ Action déjà effectuée",
  USER_NOT_IDENTIFIED: "Utilisateur non identifié",
} as const;

interface PresenceApiResponse {
  message: string;
  retard_minutes?: number;
  heures_supplementaires?: number;
}

interface HebdomadaireMetrics {
  retard: number;
  supplementaires: number;
  objectif: number;
  objectifAtteint: number;
}

// Interface pour la réponse de l'API hebdomadaire
interface HebdomadaireData {
  retard: number;
  supplementaires: number;
  objectif: number;
  objectifAtteint: number;
}

interface HebdomadaireApiResponse {
  data: HebdomadaireData;
  message?: string;
  status?: number;
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

  const [isLoading, setIsLoading] = useState(false); // Pour les pointages
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false); // Pour les métriques
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // Fonction utilitaire pour formater l'heure
  const getFormattedTime = useCallback((): string => {
    return new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Gestionnaire d'erreur centralisé
  const handleError = useCallback((error: unknown, customMessage?: string) => {
    const errorMessage =
      customMessage ||
      (error instanceof Error ? error.message : MESSAGES.SERVER_ERROR);

    setError(errorMessage);
    Alert.alert(MESSAGES.ERROR_TITLE, errorMessage, [
      { text: MESSAGES.CLOSE, style: "cancel" },
    ]);
  }, []);

  const loadHebdomadaire = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setIsLoadingMetrics(true);
      const response = await getHebdomadaireById({
        id: currentUser.id,
      }) as HebdomadaireApiResponse;

      if (response?.data) {
        setMetrics({
          retard: response.data.retard ?? 0,
          supplementaires: response.data.supplementaires ?? 0,
          objectif: response.data.objectif ?? 35,
          objectifAtteint: response.data.objectifAtteint ?? 0,
        });
      }
    } catch (err) {
      console.error("Erreur chargement hebdomadaire:", err);
      // Optionnel : afficher une notification discrète
      Alert.alert(
        "Information",
        "Impossible de charger les statistiques hebdomadaires",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [currentUser?.id]);

  // Rafraîchissement manuel des métriques
  const refreshMetrics = useCallback(() => {
    return loadHebdomadaire();
  }, [loadHebdomadaire]);

  // Charger les données hebdomadaires au montage du hook
  useEffect(() => {
    loadHebdomadaire();
  }, [loadHebdomadaire]);

  const handlePointage = useCallback(
    async (type: ActionType, source: PointageSource = "MANUEL") => {
      // Vérifier que l'utilisateur est connecté
      if (!currentUser?.id) {
        Alert.alert(MESSAGES.ERROR_TITLE, MESSAGES.USER_NOT_IDENTIFIED, [
          { text: "OK" },
        ]);
        return;
      }

      // Validation : empêcher de pointer deux fois la même action
      if (
        (type === "ENTREE" && presence.heure_entree) ||
        (type === "SORTIE" && presence.heure_sortie)
      ) {
        Alert.alert(
          MESSAGES.ALREADY_DONE,
          `Vous avez déjà enregistré votre ${type === "ENTREE" ? "arrivée" : "départ"}`,
          [{ text: "OK" }],
        );
        return;
      }

      // Validation : ne pas permettre une sortie sans entrée
      if (type === "SORTIE" && !presence.heure_entree) {
        Alert.alert(
          MESSAGES.ERROR_TITLE,
          "Vous devez d'abord enregistrer votre arrivée",
          [{ text: "OK" }],
        );
        return;
      }

      setIsLoading(true);
      setError(null);

      const now = new Date();

      // Format de date pour l'API
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const dateTimeToSend = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      try {
        const response = await postPresence({
          id_utilisateur: currentUser.id,
          date_presence: `${year}-${month}-${day}`,
          datetime: dateTimeToSend,
          source,
          permissions: ["attendance.events.approve"],
        });

        const responseData = response.data as PresenceApiResponse;

        if (response.status >= 200 && response.status < 300) {
          const heureFormatee = getFormattedTime();

          setPresence((prev) => ({
            ...prev,
            [type === "ENTREE" ? "heure_entree" : "heure_sortie"]: heureFormatee,
            retard_minutes: responseData.retard_minutes || prev.retard_minutes,
            heures_supplementaires: responseData.heures_supplementaires || prev.heures_supplementaires,
          }));

          // Recharger les données hebdomadaires après un pointage réussi
          await refreshMetrics();

          Alert.alert(
            MESSAGES.SUCCESS_TITLE,
            responseData.message || "Votre pointage a été validé",
            [{ text: MESSAGES.CLOSE }],
          );
        } else {
          throw new Error(responseData.message || "Erreur inconnue");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message;
        handleError(err, errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentUser?.id,
      presence.heure_entree,
      presence.heure_sortie,
      getFormattedTime,
      handleError,
      refreshMetrics,
    ],
  );

  const resetPresence = useCallback(() => {
    setPresence({
      heure_entree: null,
      heure_sortie: null,
      retard_minutes: 0,
      heures_supplementaires: 0,
    });
    setError(null);
  }, []);

  const canPoint = useCallback(
    (type: ActionType): boolean => {
      if (type === "ENTREE") {
        return !presence.heure_entree;
      }
      return !!(presence.heure_entree && !presence.heure_sortie);
    },
    [presence.heure_entree, presence.heure_sortie],
  );

  const handleMetricPress = useCallback((metric: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (metric) {
      case "retard":
        Alert.alert(
          "Détail des retards", 
          `Total cumulé : ${metrics.retard} minutes`
        );
        break;
      case "supplementaires":
        Alert.alert(
          "Heures supplémentaires", 
          `${metrics.supplementaires}h effectuées`
        );
        break;
      case "objectif":
        const reste = Math.max(0, metrics.objectif - metrics.objectifAtteint);
        Alert.alert(
          "Objectif hebdomadaire",
          `${metrics.objectifAtteint}h / ${metrics.objectif}h atteints\n` +
          `Reste : ${reste}h à effectuer`
        );
        break;
    }
  }, [metrics]);

  return {
    presence,
    metrics,
    isLoading,
    isLoadingMetrics,
    error,
    handlePointage,
    resetPresence,
    canPoint,
    refreshMetrics,
    handleMetricPress,
  };
};