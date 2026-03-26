import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { styles } from '../styles/QRSuccessStyles';
import { COLORS } from '@/screens/dashboard/constants/color';

interface ExpandedDetailsProps {
  dateTime: { date: string; time: string };
  zoneName?: string;
  distance?: number;
  retard_minutes?: number;
  heures_supplementaires?: number;
  config: any;
}

export const ExpandedDetails: React.FC<ExpandedDetailsProps> = ({
  dateTime,
  zoneName,
  distance,
  retard_minutes,
  heures_supplementaires,
  config,
}) => {
  // ✅ Utilisation de l'opérateur de coalescence nulle pour les valeurs par défaut
  const retard = retard_minutes ?? 0;
  const heuresSupp = heures_supplementaires ?? 0;

  return (
    <Animatable.View animation="fadeInUp" duration={400} style={styles.expandedContent}>
      <View style={styles.infoGrid}>
        <View style={styles.infoGridItem}>
          <Ionicons name="calendar" size={20} color={COLORS.gray[500]} />
          <Text style={styles.infoGridLabel}>Date</Text>
          <Text style={styles.infoGridValue}>{dateTime.date}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Ionicons name="time" size={20} color={COLORS.gray[500]} />
          <Text style={styles.infoGridLabel}>Heure</Text>
          <Text style={styles.infoGridValue}>{dateTime.time}</Text>
        </View>
        {zoneName && (
          <View style={styles.infoGridItem}>
            <Ionicons name="location" size={20} color={COLORS.gray[500]} />
            <Text style={styles.infoGridLabel}>Zone</Text>
            <Text style={styles.infoGridValue}>{zoneName}</Text>
          </View>
        )}
        {distance !== undefined && (
          <View style={styles.infoGridItem}>
            <Ionicons
              name="navigate"
              size={20}
              color={distance <= 100 ? COLORS.success.main : COLORS.warning.main}
            />
            <Text style={styles.infoGridLabel}>Distance</Text>
            <Text
              style={[
                styles.infoGridValue,
                distance <= 100 ? styles.successText : styles.warningText,
              ]}
            >
              {Math.round(distance)} m
            </Text>
          </View>
        )}
      </View>

      {(retard > 0 || heuresSupp > 0) && (
        <View style={styles.statsContainer}>
          {retard > 0 && (
            <View style={styles.statCard}>
              <Ionicons name="alert-circle" size={24} color={COLORS.warning.main} />
              <Text style={styles.statValue}>{retard} min</Text>
              <Text style={styles.statLabel}>de retard</Text>
            </View>
          )}
          {heuresSupp > 0 && (
            <View style={styles.statCard}>
              <Ionicons name="flash" size={24} color={COLORS.success.main} />
              <Text style={styles.statValue}>+{heuresSupp} h</Text>
              <Text style={styles.statLabel}>supplémentaires</Text>
            </View>
          )}
        </View>
      )}
    </Animatable.View>
  );
};