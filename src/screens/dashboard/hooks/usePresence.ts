import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { ID_UTILISATEUR } from "../constants/dashboard.constants";
import { postPresence } from "../services/presenceService";
import {
    ActionType,
    PointageResponse,
    PointageSource,
    PresenceState,
} from "../types/presence.types";

// Messages constants pour éviter la duplication
const MESSAGES = {
  SUCCESS_TITLE: "✅ Pointage enregistré",
  ERROR_TITLE: "❌ Erreur",
  SERVER_ERROR: "Impossible de contacter le serveur",
  RETRY: "Réessayer",
  CLOSE: "Fermer",
  ALREADY_DONE: "⏰ Action déjà effectuée",
} as const;

// Type guard pour valider la réponse
function isPointageResponse(data: unknown): data is PointageResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    typeof (data as any).success === "boolean" &&
    "message" in data &&
    typeof (data as any).message === "string"
  );
}

export const usePresence = () => {
  const [presence, setPresence] = useState<PresenceState>({
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      { text: MESSAGES.RETRY, style: "cancel" },
    ]);
  }, []);

  const handlePointage = useCallback(
    async (type: ActionType, source: PointageSource = "MANUEL") => {
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

      setIsLoading(true);
      setError(null);

      const now = new Date();

      try {
        const response = await postPresence({
          id_utilisateur: ID_UTILISATEUR,
          date_presence: now.toISOString().slice(0, 10),
          datetime: now.toISOString(),
          source,
          permissions: ["attendance.events.approve"],
        });

        // Solution 1: Type assertion (si vous êtes sûr du format)
        const pointageResponse = response.data as PointageResponse;

        // OU Solution 2: Type guard (plus sûr)
        // const pointageResponse = response.data;
        // if (!isPointageResponse(pointageResponse)) {
        //   throw new Error('Format de réponse invalide');
        // }

        if (pointageResponse.success) {
          const heureFormatee = getFormattedTime();

          setPresence((prev) => ({
            ...prev,
            [type === "ENTREE" ? "heure_entree" : "heure_sortie"]:
              heureFormatee,
            ...(pointageResponse.data || {}),
          }));

          Alert.alert(
            MESSAGES.SUCCESS_TITLE,
            pointageResponse.message || "Votre pointage a été validé",
            [{ text: MESSAGES.CLOSE, style: "default" }],
          );
        } else {
          handleError(
            new Error(pointageResponse.message),
            pointageResponse.message,
          );
        }
      } catch (err: any) {
        // Gestion des erreurs réseau ou autres
        const errorMessage = err.response?.data?.message || err.message;
        handleError(err, errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      presence.heure_entree,
      presence.heure_sortie,
      getFormattedTime,
      handleError,
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

  // Vérifier si l'utilisateur peut pointer
  const canPoint = useCallback(
    (type: ActionType): boolean => {
      if (type === "ENTREE") {
        return !presence.heure_entree;
      }
      return !!(presence.heure_entree && !presence.heure_sortie);
    },
    [presence.heure_entree, presence.heure_sortie],
  );

  return {
    presence,
    isLoading,
    error,
    handlePointage,
    resetPresence,
    canPoint,
  };
};
