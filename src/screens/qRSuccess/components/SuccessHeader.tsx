// screens/qr-success/components/SuccessHeader.tsx
import React from 'react';
import { Text, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../styles/QRSuccessStyles';

interface SuccessHeaderProps {
  title: string;
  subtitle: string;
  fadeAnim: Animated.Value;
  translateYAnim: Animated.Value;
}

export const SuccessHeader: React.FC<SuccessHeaderProps> = ({
  title,
  subtitle,
  fadeAnim,
  translateYAnim,
}) => {
  return (
    <>
      <Animatable.Text
        animation="fadeInUp"
        delay={200}
        duration={800}
        style={styles.title}
      >
        {title}
      </Animatable.Text>

      <Animatable.Text
        animation="fadeInUp"
        delay={300}
        duration={800}
        style={styles.subtitle}
      >
        {subtitle}
      </Animatable.Text>
    </>
  );
};