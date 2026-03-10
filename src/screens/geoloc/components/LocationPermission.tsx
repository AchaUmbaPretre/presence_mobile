import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface LocationPermissionProps {
  onRequestPermission: () => void;
  onClose?: () => void;
}

export const LocationPermission: React.FC<LocationPermissionProps> = ({
  onRequestPermission,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary.light, COLORS.white]}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={60} color={COLORS.primary.main} />
        </View>

        <Text style={styles.title}>Localisation requise</Text>
        <Text style={styles.message}>
          Pour utiliser le pointage par géolocalisation, nous avons besoin
          d'accéder à votre position. Activez la localisation pour continuer.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={onRequestPermission}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[COLORS.primary.main, COLORS.primary.dark]}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Autoriser la localisation</Text>
          </LinearGradient>
        </TouchableOpacity>

        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Plus tard</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: getFontFamily("bold"),
    color: COLORS.gray[900],
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.white,
  },
  closeButton: {
    paddingVertical: 12,
  },
  closeButtonText: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[500],
  },
});
