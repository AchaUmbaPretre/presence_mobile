// screens/qr-code/utils/qrUtils.ts
import { Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

export const extractQRCode = (data: string): string => {
  let code = data;
  if (data.includes("code=")) {
    const urlParams = new URLSearchParams(data.split("?")[1]);
    code = urlParams.get("code") || data;
  }
  return code;
};

export const handleQRValidationError = (
  error: any,
  onRetry: () => void,
  navigation: NavigationProp<any>
): string => {
  let errorMessage = error.message;
  let errorCode = error.code;

  if (error.response?.data) {
    errorMessage = error.response.data.message || errorMessage;
    errorCode = error.response.data.code;
  }

  switch (errorCode) {
    case "OUT_OF_ZONE":
      onRetry();
      return errorMessage;
    case "INVALID_QR":
      onRetry();
      return "Ce QR code n'est pas valide ou a été désactivé";
    case "NO_ACCESS":
      navigation.goBack();
      return "Vous n'avez pas accès à ce site";
    case "ALREADY_COMPLETE":
      navigation.goBack();
      return errorMessage;
    default:
      onRetry();
      return errorMessage;
  }
};