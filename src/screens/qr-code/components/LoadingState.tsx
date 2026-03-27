import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { COLORS } from '@/screens/dashboard/constants/color';
import { styles } from '../styles/QRScannerStyles';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Demande de permission caméra..." 
}) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary.main} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};