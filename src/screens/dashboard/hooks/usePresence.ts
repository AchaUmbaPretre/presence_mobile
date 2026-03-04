import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { ID_UTILISATEUR } from "../constants/dashboard.constants";
import { presenceService } from "../services/presenceService";
import { ActionType, PresenceState } from "../types/presence.types";

export const usePresence = () => {
  const [presence, setPresence] = useState<PresenceState>({
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePointage = useCallback(async (type: ActionType) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await presenceService.enregistrerPointage({
        id_utilisateur: ID_UTILISATEUR,
        date_presence: new Date().toISOString().slice(0, 10),
        datetime: new Date().toISOString(),
        source: "MANUEL",
        permissions: ["attendance.events.approve"],
      });

      if (response.success) {
        setPresence((prev) => ({
          ...prev,
          [type === "ENTREE" ? "heure_entree" : "heure_sortie"]:
            new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          ...(response.data || {}),
        }));

        Alert.alert("✅ Pointage enregistré", response.message, [
          { text: "Fermer", style: "default" },
        ]);
      } else {
        setError(response.message);
        Alert.alert("❌ Erreur", response.message, [
          { text: "Réessayer", style: "cancel" },
        ]);
      }
    } catch (err: any) {
      const errorMessage = "Impossible de contacter le serveur";
      setError(errorMessage);
      Alert.alert("❌ Erreur", errorMessage, [
        { text: "Réessayer", style: "cancel" },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPresence = useCallback(() => {
    setPresence({
      heure_entree: null,
      heure_sortie: null,
      retard_minutes: 0,
      heures_supplementaires: 0,
    });
    setError(null);
  }, []);

  return {
    presence,
    isLoading,
    error,
    handlePointage,
    resetPresence,
  };
};
