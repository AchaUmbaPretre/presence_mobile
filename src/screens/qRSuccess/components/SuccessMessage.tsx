import React from 'react';
import { View, Text, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/QRSuccessStyles';
import { COLORS } from '@/screens/dashboard/constants/color';

interface SuccessMessageProps {
  message: string;
  config: any;
  fadeAnim: Animated.Value;
  translateYAnim: Animated.Value;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  config,
  fadeAnim,
  translateYAnim,
}) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      delay={400}
      duration={800}
      style={styles.messageCard}
    >
      <View style={styles.messageContent}>
        <View style={[styles.messageIcon, { backgroundColor: `${config.primary.main}15` }]}>
          <Ionicons name="information-circle" size={24} color={config.primary.main} />
        </View>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </Animatable.View>
  );
};