import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { postPresence } from '@/api/presences';
import type { PresenceState, ActionType } from '../types/presence.types';

const ID_UTILISATEUR = 1;

export const usePresence = () => {
  const [presence, setPresence] = useState<PresenceState>({
    heure_entree: null,
    heure_sortie: null,
    retard_minutes: 0,
    heures_supplementaires: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePointage = useCallback(async (type: ActionType) => {
    setIsLoading(true);
    try {
      const res = await postPresence({
        id_utilisateur: ID_UTILISATEUR,
        date_presence: new Date().toISOString().slice(0, 10),
        datetime: new Date().toISOString(),
        source: "MANUEL",
        permissions: ["attendance.events.approve"],
      });

      setPresence(prev => ({
        ...prev,
        [type === "ENTREE" ? "heure_entree" : "heure_sortie"]:
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
      }));

      Alert.alert(
        "Pointage enregistré",
        res.data?.message || "Votre pointage a été validé",
        [{ text: "Fermer", style: "default" }]
      );
    } catch (err: any) {
      Alert.alert(
        "Erreur",
        err.response?.data?.message || "Impossible de contacter le serveur",
        [{ text: "Réessayer", style: "cancel" }]
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { presence, isLoading, handlePointage };
};