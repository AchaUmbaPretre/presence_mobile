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

  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const response = (await getHebdomadaireById({
        id: currentUser.id,
      })) as HebdomadaireApiResponse;

      if (response?.data) {
        setMetrics({
          retard: response.data.retard ?? 0,
          supplementaires: response.data.supplementaires ?? 0,
          objectif: response.data.objectif ?? 27,
          objectifAtteint: response.data.objectifAtteint ?? 0,
        });
      }
    } catch (err) {
      console.error("Erreur chargement hebdomadaire:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

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

      // ✅ AJOUTER +1h pour compenser le backend (à confirmer si toujours nécessaire)
      const adjustedHours = String((now.getHours() + 1) % 24).padStart(2, "0");

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const dateTimeToSend = `${year}-${month}-${day} ${adjustedHours}:${minutes}:${seconds}`;

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
            [type === "ENTREE" ? "heure_entree" : "heure_sortie"]:
              heureFormatee,
            retard_minutes: responseData.retard_minutes || prev.retard_minutes,
            heures_supplementaires:
              responseData.heures_supplementaires ||
              prev.heures_supplementaires,
          }));

          // Recharger les données hebdomadaires après un pointage réussi
          await loadHebdomadaire();

          Alert.alert(
            MESSAGES.SUCCESS_TITLE,
            responseData.message || "Votre pointage a été validé",
            [{ text: MESSAGES.CLOSE }],
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
      currentUser?.id,
      presence.heure_entree,
      presence.heure_sortie,
      getFormattedTime,
      handleError,
      loadHebdomadaire,
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
    metrics,
    isLoading,
    error,
    handlePointage,
    resetPresence,
    canPoint,
    loadHebdomadaire,
  };
};
