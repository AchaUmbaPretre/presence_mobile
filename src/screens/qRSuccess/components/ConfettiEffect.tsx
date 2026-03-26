import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../styles/QRSuccessStyles';

export const ConfettiEffect: React.FC = () => {
  return (
    <View style={styles.confettiContainer}>
      {[...Array(80)].map((_, i) => (
        <Animatable.View
          key={i}
          animation="bounceIn"
          delay={Math.random() * 2000}
          duration={1200}
          style={[
            styles.confetti,
            {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
              width: Math.random() * 10 + 4,
              height: Math.random() * 10 + 4,
              transform: [{ rotate: `${Math.random() * 360}deg` }],
            },
          ]}
        />
      ))}
    </View>
  );
};