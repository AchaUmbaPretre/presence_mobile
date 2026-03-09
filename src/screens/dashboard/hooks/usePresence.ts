import { useState, useCallback } from 'react'
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { postPresence } from "../services/presenceService";
import {
    ActionType,
    PointageSource,
    PresenceState
} from "../types/presence.types";

const MESSAGES = {
  SUCCESS_TITLE: "✅ Pointage enregistré",
  ERROR_TITLE: "❌ Erreur",
  SERVER_ERROR: "Impossible de contacter le serveur",
  RETRY: "Réessayer",
  CLOSE: "Fermer",
  ALREADY_DONE: "⏰ Action déjà effectuée",
} as const;

interface PresenceApiResponse {
  message: string;
  retard_minutes?: number;
  heures_supplementaires?: number;
  // ajoutez d'autres champs si nécessaire
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
  const data = useSelector((state: RootState) => state.auth.currentUser);

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
      // Vérifier que l'utilisateur est connecté
      if (!data?.id) {
        Alert.alert("Erreur", "Utilisateur non identifié", [{ text: "OK" }]);
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

      setIsLoading(true);
      setError(null);

      const now = new Date();

      try {
        // ✅ Typer la réponse Axios
        const response = await postPresence({
          id_utilisateur: data.id,
          date_presence: now.toISOString().slice(0, 10),
          datetime: now.toISOString(),
          source,
          permissions: ["attendance.events.approve"],
        });

        // ✅ Maintenant response.data est typé correctement
        const responseData = response.data as PresenceApiResponse;

        // Vérification par le code HTTP
        if (response.status >= 200 && response.status < 300) {
          const heureFormatee = getFormattedTime();

          setPresence((prev) => ({
            ...prev,
            [type === "ENTREE" ? "heure_entree" : "heure_sortie"]:
              heureFormatee,
            retard_minutes: responseData.retard_minutes || 0,
            heures_supplementaires: responseData.heures_supplementaires || 0,
          }));

          Alert.alert(
            MESSAGES.SUCCESS_TITLE,
            responseData.message || "Votre pointage a été validé",
            [{ text: MESSAGES.CLOSE, style: "default" }],
          );
        } else {
          handleError(new Error(responseData.message || "Erreur inconnue"));
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message;
        handleError(err, errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      data,
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