import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';
import { QRPayload } from './types/qr.types';
import { QRScanner } from './components/QRScanner';
import { QRResult } from './components/QRResult';

export const QRScannerScreen = () => {
  const navigation = useNavigation();
  const [scanResult, setScanResult] = useState<QRPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScanSuccess = (data: QRPayload) => {
    setScanResult(data);
    setErrorMessage(null);
  };

  const handleScanError = (error: string) => {
    setErrorMessage(error);
    setScanResult(null);
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const handleRetry = () => {
    setScanResult(null);
    setErrorMessage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />

      {!scanResult && !errorMessage ? (
        <QRScanner
          onScan={handleScanSuccess}
          onClose={handleClose}
          onError={handleScanError}
        />
      ) : (
        <View style={styles.resultContainer}>
          <LinearGradient
            colors={[COLORS.gray[50], COLORS.white]}
            style={StyleSheet.absoluteFill}
          />
          
          <QRResult
            success={!!scanResult}
            message={
              scanResult
                ? 'Pointage enregistré avec succès'
                : errorMessage || 'Erreur inconnue'
            }
            data={scanResult || undefined}
            onClose={handleClose}
            onRetry={handleRetry}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRScannerScreen;