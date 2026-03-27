import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Erreur permission caméra:", error);
    return false;
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Erreur permission localisation:", error);
    return false;
  }
};

export const getCurrentPosition = async () => {
  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
};