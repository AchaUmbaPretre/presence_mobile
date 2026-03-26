import React from 'react';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/QRSuccessStyles';
import { AnimatedCircle } from './AnimatedCircle';

interface SuccessIconProps {
  config: any;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
  spinAnim: Animated.AnimatedInterpolation<string | number>; // ✅ Type plus flexible
  fadeAnim: Animated.Value;
}

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  config,
  scaleAnim,
  pulseAnim,
  spinAnim,
  fadeAnim,
}) => {
  return (
    <Animated.View
      style={[
        styles.iconWrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <AnimatedCircle gradientColors={config.gradientColors} primaryColor={config.primary.main} />
      
      <Animated.View
        style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.92)']}
          style={styles.iconBackground}
        >
          <Animated.View style={{ transform: [{ rotate: spinAnim }] }}>
            <Ionicons name="checkmark" size={72} color={config.primary.main} />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};