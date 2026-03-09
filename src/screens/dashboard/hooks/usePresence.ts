import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { postPresence } from "../services/presenceService";
import {
  ActionType,
  PointageSource,
  PresenceState,
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

      // ✅ AJOUTER +1h pour compenser le backend
      const adjustedHours = String((now.getHours() + 1) % 24).padStart(2, "0");

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const dateTimeToSend = `${year}-${month}-${day} ${adjustedHours}:${minutes}:${seconds}`;

      try {
        const response = await postPresence({
          id_utilisateur: data.id,
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
