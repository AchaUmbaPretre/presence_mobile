import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Coordinates, LocationStatus, LocationError, LocationPermission } from '../types/geoloc.types';
import { LOCATION_ACCURACY, LOCATION_MESSAGES } from '../constants/geoloc.constants';

interface UseLocationProps {
  siteCoordinates: Coordinates;
  siteRadius: number;
  onStatusChange?: (status: LocationStatus) => void;
}

export const useLocation = ({
  siteCoordinates,
  siteRadius,
  onStatusChange,
}: UseLocationProps) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [status, setStatus] = useState<LocationStatus>({
    isWithinZone: false,
    distance: 0,
    accuracy: 0,
    timestamp: 0,
  });
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<LocationPermission>({
    granted: false,
    canAskAgain: true,
  });

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Rayon de la Terre en mètres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en mètres
  }, []);

  const checkZone = useCallback((coords: Coordinates) => {
    const distance = calculateDistance(
      coords.latitude,
      coords.longitude,
      siteCoordinates.latitude,
      siteCoordinates.longitude
    );

    const isWithinZone = distance <= siteRadius;

    const newStatus: LocationStatus = {
      isWithinZone,
      distance: Math.round(distance),
      accuracy: 0,
      timestamp: Date.now(),
    };

    setStatus(newStatus);
    onStatusChange?.(newStatus);

    // Feedback haptique selon la zone
    if (isWithinZone) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (distance > siteRadius * 2) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    return newStatus;
  }, [siteCoordinates, siteRadius, calculateDistance, onStatusChange]);

  const requestPermission = useCallback(async () => {
    try {
      const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
      
      if (existingStatus === 'granted') {
        setPermission({ granted: true, canAskAgain: true });
        return true;
      }

      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      setPermission({ granted: status === 'granted', canAskAgain });
      
      return status === 'granted';
    } catch (err) {
      setError({ code: 'PERMISSION_ERROR', message: String(err) });
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError({
          code: 'PERMISSION_DENIED',
          message: LOCATION_MESSAGES.permissionDenied,
        });
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(location);
      
      const status = checkZone({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setStatus(prev => ({
        ...prev,
        accuracy: location.coords.accuracy || 0,
      }));

      // Vérifier la précision
      if (location.coords.accuracy && location.coords.accuracy > LOCATION_ACCURACY.medium) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

    } catch (err) {
      setError({
        code: 'LOCATION_ERROR',
        message: LOCATION_MESSAGES.error,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [checkZone, requestPermission]);

  // Rafraîchir périodiquement
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (permission.granted) {
      getCurrentLocation();
      interval = setInterval(getCurrentLocation, 30000); // Toutes les 30 secondes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [permission.granted, getCurrentLocation]);

  return {
    location,
    status,
    error,
    isLoading,
    permission,
    getCurrentLocation,
    requestPermission,
  };
};