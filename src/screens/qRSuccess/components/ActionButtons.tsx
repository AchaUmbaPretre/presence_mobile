// screens/qr-success/components/ActionButtons.tsx
import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Text } from 'react-native';
import { COLORS } from '@/screens/dashboard/constants/color';
import { styles } from '../styles/QRSuccessStyles';

interface ActionButtonsProps {
  onHomePress: () => void;
  onHistoryPress: () => void;
  config: any;
  fadeAnim: Animated.Value;
  translateYAnim: Animated.Value;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onHomePress,
  onHistoryPress,
  config,
  fadeAnim,
  translateYAnim,
}) => {
  return (
    <Animatable.View animation="fadeInUp" delay={700} duration={800} style={styles.actionsContainer}>
      <TouchableOpacity activeOpacity={0.8} onPress={onHomePress} style={styles.actionButton}>
        <LinearGradient colors={[COLORS.white, COLORS.gray[50]]} style={styles.actionButtonGradient}>
          <Ionicons name="home" size={22} color={config.primary.main} />
          <Text style={[styles.actionButtonText, { color: config.primary.main }]}>Accueil</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onHistoryPress}
        style={[styles.actionButton, styles.actionButtonSecondary]}
      >
        <LinearGradient
          colors={config.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.actionButtonGradient}
        >
          <Ionicons name="time" size={22} color={COLORS.white} />
          <Text style={[styles.actionButtonText, { color: COLORS.white }]}>Historique</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};