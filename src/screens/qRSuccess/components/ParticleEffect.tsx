import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { styles } from '../styles/QRSuccessStyles';

export const ParticleEffect: React.FC = () => {
  return (
    <View style={styles.particleContainer}>
      {[...Array(40)].map((_, i) => (
        <Animatable.View
          key={i}
          animation="fadeInUp"
          duration={2000 + Math.random() * 2000}
          delay={Math.random() * 3000}
          iterationCount="infinite"
          style={[
            styles.particle,
            {
              left: `${Math.random() * 100}%`,
              bottom: -20,
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              opacity: Math.random() * 0.4,
            },
          ]}
        />
      ))}
    </View>
  );
};