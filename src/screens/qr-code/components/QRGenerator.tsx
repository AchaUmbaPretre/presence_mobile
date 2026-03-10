import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { useQRGenerator } from '../hooks/useQRGenerator';
import { QRGeneratorProps } from '../types/qr.types';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  terminalId,
  siteId,
  size = 200,
  onGenerate,
}) => {
  const {
    qrData,
    isGenerating,
    error,
    timeRemaining,
    terminalInfo,
    refresh,
  } = useQRGenerator({
    terminalId,
    siteId,
    autoRefresh: true,
  });

  React.useEffect(() => {
    if (qrData && onGenerate) {
      onGenerate(qrData);
    }
  }, [qrData]);

  const formatTime = (seconds: number) => {
    const secs = Math.floor(seconds % 60);
    return `00:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.white, COLORS.gray[50]]}
        style={styles.qrContainer}
      >
        {isGenerating && !qrData ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary.main} />
            <Text style={styles.loadingText}>Génération du QR code...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={COLORS.error.main} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
            <View style={styles.qrWrapper}>
              <QRCode
                value={qrData}
                size={size}
                color={COLORS.gray[900]}
                backgroundColor="transparent"
              />
              
              {/* Timer overlay */}
              <View style={styles.timerContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.timerGradient}
                >
                  <Ionicons name="time-outline" size={16} color={COLORS.primary.main} />
                  <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Infos terminal */}
            <View style={styles.infoContainer}>
              {Platform.OS === 'ios' && (
                <BlurView intensity={80} tint="light" style={styles.infoBlur}>
                  <View style={styles.infoContent}>
                    <Ionicons name="business" size={16} color={COLORS.primary.main} />
                    <Text style={styles.infoText}>
                      {terminalInfo?.siteName || `Site #${siteId}`}
                    </Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Ionicons name="hardware-chip" size={16} color={COLORS.primary.main} />
                    <Text style={styles.infoText}>
                      {terminalInfo?.name || `Terminal #${terminalId}`}
                    </Text>
                  </View>
                </BlurView>
              )}

              {Platform.OS === 'android' && (
                <View style={styles.infoAndroid}>
                  <View style={styles.infoContent}>
                    <Ionicons name="business" size={16} color={COLORS.primary.main} />
                    <Text style={styles.infoText}>
                      {terminalInfo?.siteName || `Site #${siteId}`}
                    </Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Ionicons name="hardware-chip" size={16} color={COLORS.primary.main} />
                    <Text style={styles.infoText}>
                      {terminalInfo?.name || `Terminal #${terminalId}`}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <Text style={styles.hint}>
              Ce QR code expire dans 30 secondes pour des raisons de sécurité
            </Text>
          </>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  qrContainer: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  qrWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  timerContainer: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  timerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.primary.main,
  },
  infoContainer: {
    width: '100%',
    marginTop: 8,
  },
  infoBlur: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
  },
  infoAndroid: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[700],
  },
  hint: {
    fontSize: 12,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[600],
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.error.main,
    textAlign: 'center',
    marginTop: 12,
  },
});