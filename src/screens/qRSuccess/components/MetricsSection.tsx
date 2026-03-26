// screens/qr-success/components/MetricsSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/QRSuccessStyles';

interface MetricsSectionProps {
  typeScan: 'ENTREE' | 'SORTIE';
  siteName: string;
  config: any;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  typeScan,
  siteName,
  config,
}) => {
  const currentTime = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.metricsContainer}>
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>{currentTime}</Text>
        <Text style={styles.metricLabel}>Heure</Text>
      </View>
      <View style={styles.metricDivider} />
      <View style={styles.metricItem}>
        <Text style={styles.metricValue}>{siteName}</Text>
        <Text style={styles.metricLabel}>Site</Text>
      </View>
      <View style={styles.metricDivider} />
      <View style={styles.metricItem}>
        <Text
          style={[
            styles.metricValue,
            typeScan === 'ENTREE' ? styles.entreeText : styles.sortieText,
          ]}
        >
          {typeScan === 'ENTREE' ? 'Entrée' : 'Sortie'}
        </Text>
        <Text style={styles.metricLabel}>Type</Text>
      </View>
    </View>
  );
};