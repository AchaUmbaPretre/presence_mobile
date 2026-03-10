import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { QRResultProps } from '../types/qr.types';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

export const QRResult: React.FC<QRResultProps> = ({
  success,
  message,
  data,
  terminalInfo,
  onClose,
  onRetry,
}) => {
  React.useEffect(() => {
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [success]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.white, COLORS.gray[50]]}
        style={styles.content}
      >
        <View
          style={[
            styles.iconContainer,
            success ? styles.iconSuccess : styles.iconError,
          ]}
        >
          <Ionicons
            name={success ? 'checkmark-circle' : 'alert-circle'}
            size={60}
            color={success ? COLORS.success.main : COLORS.error.main}
          />
        </View>

        <Text style={styles.title}>
          {success ? 'Scan réussi !' : 'Scan échoué'}
        </Text>
        <Text style={styles.message}>{message}</Text>

        {success && data && (
          <View style={styles.detailsContainer}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={80} tint="light" style={styles.detailsBlur}>
                <DetailRow
                  icon="business"
                  label="Site"
                  value={terminalInfo?.siteName || `Site #${data.siteId}`}
                />
                <DetailRow
                  icon="hardware-chip"
                  label="Terminal"
                  value={terminalInfo?.name || `Terminal #${data.terminalId}`}
                />
                <DetailRow
                  icon="time"
                  label="Horodatage"
                  value={new Date(data.timestamp).toLocaleTimeString('fr-FR')}
                />
              </BlurView>
            ) : (
              <View style={styles.detailsAndroid}>
                <DetailRow
                  icon="business"
                  label="Site"
                  value={terminalInfo?.siteName || `Site #${data.siteId}`}
                />
                <DetailRow
                  icon="hardware-chip"
                  label="Terminal"
                  value={terminalInfo?.name || `Terminal #${data.terminalId}`}
                />
                <DetailRow
                  icon="time"
                  label="Horodatage"
                  value={new Date(data.timestamp).toLocaleTimeString('fr-FR')}
                />
              </View>
            )}
          </View>
        )}

        <View style={styles.actions}>
          {!success && onRetry && (
            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={onRetry}
            >
              <Ionicons name="refresh" size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Réessayer</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const DetailRow = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon} size={18} color={COLORS.primary.main} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconSuccess: {
    backgroundColor: `${COLORS.success.main}15`,
  },
  iconError: {
    backgroundColor: `${COLORS.error.main}15`,
  },
  title: {
    fontSize: 24,
    fontFamily: getFontFamily('bold'),
    color: COLORS.gray[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  detailsBlur: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  detailsAndroid: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[500],
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[900],
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  retryButton: {
    backgroundColor: COLORS.primary.main,
  },
  closeButton: {
    backgroundColor: COLORS.gray[500],
  },
  buttonText: {
    fontSize: 14,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.white,
  },
});