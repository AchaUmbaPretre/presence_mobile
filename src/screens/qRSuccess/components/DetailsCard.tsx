// screens/qr-success/components/DetailsCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

import { COLORS } from '@/screens/dashboard/constants/color';
import { styles } from '../styles/QRSuccessStyles';
import { MetricsSection } from './MetricsSection';
import { ExpandedDetails } from './ExpandedDetails';

interface DetailsCardProps {
  params: any;
  config: any;
  dateTime: { date: string; time: string };
  cardExpanded: boolean;
  onToggleExpand: () => void;
  fadeAnim: Animated.Value;
  translateYAnim: Animated.Value;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({
  params,
  config,
  dateTime,
  cardExpanded,
  onToggleExpand,
  fadeAnim,
  translateYAnim,
}) => {
  const {
    typeScan,
    siteName,
    zoneName,
    distance,
    retard_minutes,
    heures_supplementaires,
  } = params;

  return (
    <Animatable.View animation="fadeInUp" delay={500} duration={800} style={styles.detailsWrapper}>
      <Animated.View
        style={[
          styles.detailsCard,
          {
            transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }],
          },
        ]}
      >
        <LinearGradient colors={[COLORS.white, COLORS.gray[50]]} style={styles.detailsCardGradient}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardHeaderBadge, { backgroundColor: `${config.primary.main}15` }]}>
                <Ionicons name="trophy" size={16} color={config.primary.main} />
              </View>
              <Text style={styles.cardHeaderTitle}>Récapitulatif</Text>
            </View>
            <TouchableOpacity onPress={onToggleExpand} style={styles.expandButton}>
              <Ionicons name={cardExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.gray[500]} />
            </TouchableOpacity>
          </View>

          <MetricsSection
            typeScan={typeScan}
            siteName={siteName}
            config={config}
          />

          {cardExpanded && (
            <ExpandedDetails
              dateTime={dateTime}
              zoneName={zoneName}
              distance={distance}
              retard_minutes={retard_minutes}
              heures_supplementaires={heures_supplementaires}
              config={config}
            />
          )}
        </LinearGradient>
      </Animated.View>
    </Animatable.View>
  );
};