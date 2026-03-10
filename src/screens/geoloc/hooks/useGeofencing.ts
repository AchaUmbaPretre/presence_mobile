import { useState, useEffect, useCallback } from 'react';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Coordinates } from '../types/geoloc.types';

const GEOFENCING_TASK = 'GEOFENCING_TASK';

interface UseGeofencingProps {
  siteCoordinates: Coordinates;
  siteRadius: number;
  onEnterZone?: () => void;
  onExitZone?: () => void;
}

export const useGeofencing = ({
  siteCoordinates,
  siteRadius,
  onEnterZone,
  onExitZone,
}: UseGeofencingProps) => {
  const [isTaskRegistered, setIsTaskRegistered] = useState(false);

  // Définir la tâche de géofencing - version corrigée avec async
  useEffect(() => {
    TaskManager.defineTask(GEOFENCING_TASK, async ({ data, error }) => {
      if (error) {
        console.error('Geofencing task error:', error);
        return;
      }

      if (data) {
        const { eventType, region } = data as any;
        
        if (eventType === Location.GeofencingEventType.Enter) {
          // Appeler les callbacks (ils peuvent être async ou sync)
          if (onEnterZone) {
            await Promise.resolve(onEnterZone());
          }
        } else if (eventType === Location.GeofencingEventType.Exit) {
          if (onExitZone) {
            await Promise.resolve(onExitZone());
          }
        }
      }
    });
  }, [onEnterZone, onExitZone]);

  const startGeofencing = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission de localisation refusée');
        return;
      }

      await Location.startGeofencingAsync(GEOFENCING_TASK, [
        {
          identifier: 'site-zone',
          latitude: siteCoordinates.latitude,
          longitude: siteCoordinates.longitude,
          radius: siteRadius,
          notifyOnEnter: true,
          notifyOnExit: true,
        },
      ]);

      setIsTaskRegistered(true);
    } catch (err) {
      console.error('Erreur démarrage géofencing:', err);
    }
  }, [siteCoordinates, siteRadius]);

  const stopGeofencing = useCallback(async () => {
    try {
      await Location.stopGeofencingAsync(GEOFENCING_TASK);
      setIsTaskRegistered(false);
    } catch (err) {
      console.error('Erreur arrêt géofencing:', err);
    }
  }, []);

  return {
    isTaskRegistered,
    startGeofencing,
    stopGeofencing,
  };
};