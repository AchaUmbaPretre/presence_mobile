// screens/qr-code/components/PermissionRequest.tsx
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/QRScannerStyles";

interface PermissionRequestProps {
  onRetry: () => void;
  onClose: () => void;
  message?: string;
}

export const PermissionRequest: React.FC<PermissionRequestProps> = ({
  onRetry,
  onClose,
  message = "Veuillez autoriser l'accès à la caméra dans les paramètres",
}) => {
  return (
    <View style={styles.centerContainer}>
      <View style={styles.permissionIconContainer}>
        <Ionicons name="camera-outline" size={48} color={COLORS.error.main} />
      </View>
      <Text style={styles.permissionTitle}>Accès caméra requis</Text>
      <Text style={styles.permissionMessage}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Réessayer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={onClose}
      >
        <Text style={styles.secondaryButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};
