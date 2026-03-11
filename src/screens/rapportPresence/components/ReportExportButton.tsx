import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReportExportButtonProps, ReportFormat } from '../types/report.types';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

export const ReportExportButton: React.FC<ReportExportButtonProps> = ({
  onExport,
  loading = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const formats: { value: ReportFormat; label: string; icon: string }[] = [
    { value: 'pdf', label: 'PDF', icon: 'document-text' },
    { value: 'excel', label: 'Excel', icon: 'grid' },
    { value: 'csv', label: 'CSV', icon: 'code' },
  ];

  const handleExport = (format: ReportFormat) => {
    setShowModal(false);
    onExport(format);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowModal(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.white} />
        ) : (
          <>
            <Ionicons name="download-outline" size={18} color={COLORS.white} />
            <Text style={styles.buttonText}>Exporter</Text>
          </>
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={[COLORS.primary.light, COLORS.white]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Exporter le rapport</Text>
            </LinearGradient>

            {formats.map((format) => (
              <TouchableOpacity
                key={format.value}
                style={styles.modalItem}
                onPress={() => handleExport(format.value)}
              >
                <Ionicons name={format.icon as any} size={20} color={COLORS.primary.main} />
                <Text style={styles.modalItemText}>{format.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.gray[400]} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: getFontFamily('medium'),
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[900],
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    gap: 12,
  },
  modalItemText: {
    flex: 1,
    fontSize: 15,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[800],
  },
  modalCancel: {
    padding: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[500],
  },
});