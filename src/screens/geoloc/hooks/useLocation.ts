import NetInfo from "@react-native-community/netinfo";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import {
    LOCATION_ACCURACY,
    LOCATION_MESSAGES,
} from "../constants/geoloc.constants";
import { locationService } from "../services/locationService";
import {
    Coordinates,
    LocationError,
    LocationPermission,
    LocationStatus,
    UseLocationProps,
    UseLocationReturn,
    ZoneInfo,
    ZoneVerification,
} from "../types/geoloc.types";
import { calculateDistance } from "../utils/calculateDistance";

export const useLocation = ({
  siteCoordinates,
  siteRadius,
  onStatusChange,
}: UseLocationProps): UseLocationReturn => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [status, setStatus] = useState<LocationStatus>({
    isWithinZone: false,
    distance: 0,
    accuracy: 0,
    timestamp: 0,
    currentZone: null, 
  });
  const [zoneVerification, setZoneVerification] =
    useState<ZoneVerification | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<LocationPermission>({
    granted: false,
    canAskAgain: true,
  });

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);


  const checkZoneLocally = useCallback(
    (coords: Coordinates) => {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        siteCoordinates.latitude,
        siteCoordinates.longitude,
      );

      return {
        isWithinZone: distance <= siteRadius,
        distance: Math.round(distance),
      };
    },
    [siteCoordinates, siteRadius, calculateDistance],
  );

  // APPEL DU SERVICE VERIFIER ZONE (avec req.query)
  const checkZoneWithAPI = useCallback(
    async (
      coords: Coordinates,
      accuracy: number,
    ): Promise<{ isWithinZone: boolean; zoneInfo?: ZoneInfo }> => {
      if (!currentUser?.id) {
        console.log(
          "Utilisateur non connecté, utilisation de la vérification locale",
        );
        const localCheck = checkZoneLocally(coords);
        return { isWithinZone: localCheck.isWithinZone };
      }

      try {
        console.log(
          "📍 Vérification zone avec API pour userId:",
          currentUser.id,
        );

        // Appel au service verifierZone (GET avec params)
        const response = await locationService.verifierZone(
          currentUser.id,
          coords.latitude,
          coords.longitude,
          accuracy,
        );

        console.log("✅ Réponse API zone:", response);

        if (response.success) {
          setZoneVerification(response);

          // Si une zone valide est trouvée
          if (response.data.zone) {
            console.log(
              `🎯 Zone valide trouvée: ${response.data.zone.nom_site} à ${response.data.zone.distance}m`,
            );
            return {
              isWithinZone: true,
              zoneInfo: response.data.zone,
            };
          }

          // Sinon, on utilise la zone la plus proche pour l'info
          console.log(
            `⚠️ Aucune zone valide, la plus proche: ${response.data.zone_plus_proche.nom_site} à ${response.data.zone_plus_proche.distance}m`,
          );
          return {
            isWithinZone: false,
            zoneInfo: response.data.zone_plus_proche,
          };
        }

        // Fallback sur la vérification locale si l'API échoue
        console.log("⚠️ API verification failed, using local check");
        const localCheck = checkZoneLocally(coords);
        return { isWithinZone: localCheck.isWithinZone };
      } catch (error) {
        console.error("❌ Erreur lors de la vérification API:", error);
        // Fallback sur la vérification locale
        const localCheck = checkZoneLocally(coords);
        return { isWithinZone: localCheck.isWithinZone };
      }
    },
    [currentUser?.id, checkZoneLocally],
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status: existingStatus } =
        await Location.getForegroundPermissionsAsync();

      if (existingStatus === "granted") {
        setPermission({ granted: true, canAskAgain: true });
        return true;
      }

      const { status, canAskAgain } =
        await Location.requestForegroundPermissionsAsync();
      setPermission({ granted: status === "granted", canAskAgain });

      return status === "granted";
    } catch (err) {
      setError({ code: "PERMISSION_ERROR", message: String(err) });
      return false;
    }
  }, []);

  const checkNetworkAndGPS = useCallback(async (): Promise<boolean> => {
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setError({
          code: "NETWORK_ERROR",
          message: "Pas de connexion réseau. Activez les données mobiles.",
        });
        return false;
      }

      const isGPSEnabled = await Location.hasServicesEnabledAsync();
      if (!isGPSEnabled) {
        setError({
          code: "GPS_DISABLED",
          message: "Le GPS est désactivé. Activez-le dans les paramètres.",
        });
        return false;
      }

      return true;
    } catch (err) {
      console.error("Erreur vérification réseau/GPS:", err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Vérifier réseau et GPS
      const isOk = await checkNetworkAndGPS();
      if (!isOk) {
        setIsLoading(false);
        return;
      }

      // 2. Vérifier la permission
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        setError({
          code: "PERMISSION_DENIED",
          message: LOCATION_MESSAGES.permissionDenied,
        });
        setIsLoading(false);
        return;
      }

      // 3. Obtenir la position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(location);

      const accuracy = location.coords.accuracy || 0;
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // 4. Vérifier la zone avec l'API (si utilisateur connecté)
      const zoneCheck = await checkZoneWithAPI(coords, accuracy);

      // 5. Mise à jour du statut
      const newStatus: LocationStatus = {
        isWithinZone: zoneCheck.isWithinZone,
        distance:
          zoneCheck.zoneInfo?.distance || checkZoneLocally(coords).distance,
        accuracy: accuracy,
        timestamp: Date.now(),
        currentZone: zoneCheck.zoneInfo, // Stocker la zone actuelle
      };

      setStatus(newStatus);
      onStatusChange?.(newStatus);

      // Feedback haptique selon la zone
      if (zoneCheck.isWithinZone) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // Vérifier la précision
      if (accuracy > LOCATION_ACCURACY.medium) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (err) {
      setError({
        code: "LOCATION_ERROR",
        message: LOCATION_MESSAGES.error,
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    checkZoneWithAPI,
    requestPermission,
    checkNetworkAndGPS,
    checkZoneLocally,
    onStatusChange,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (permission.granted) {
      getCurrentLocation();
      interval = setInterval(getCurrentLocation, 30000); 
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [permission.granted, getCurrentLocation]);

  return {
    location,
    status,
    zoneVerification,
    error,
    isLoading,
    permission,
    getCurrentLocation,
    requestPermission,
    checkNetworkAndGPS,
  };
};
