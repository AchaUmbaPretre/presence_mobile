import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HistoryFiltersProps } from '../types/history.types';
import { STATUS_OPTIONS, SORT_OPTIONS, HISTORY_MESSAGES } from '../constants/history.constants';
import { COLORS } from '@/screens/dashboard/constants/color';
import { getFontFamily } from '@/constants/typography';

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  visible,
  onClose,
}) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleStatusToggle = (status: string) => {
    const current = localFilters.status || [];
    const newStatus = current.includes(status as any)
      ? current.filter(s => s !== status)
      : [...current, status as any];
    
    setLocalFilters({ ...localFilters, status: newStatus });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_') as [any, 'asc' | 'desc'];
    setLocalFilters({ ...localFilters, sortBy, sortOrder });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={[COLORS.primary.main, COLORS.primary.dark]}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>{HISTORY_MESSAGES.filterTitle}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.modalBody}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recherche</Text>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={COLORS.gray[400]} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher par site, statut..."
                  placeholderTextColor={COLORS.gray[400]}
                  value={localFilters.search}
                  onChangeText={(text) => setLocalFilters({ ...localFilters, search: text })}
                />
                {localFilters.search && (
                  <TouchableOpacity
                    onPress={() => setLocalFilters({ ...localFilters, search: '' })}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.gray[400]} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Période</Text>
              <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {localFilters.startDate || 'Date début'}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.dateSeparator}>→</Text>
                <TouchableOpacity style={styles.dateButton}>
                  <Text style={styles.dateButtonText}>
                    {localFilters.endDate || 'Date fin'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statuts</Text>
              <View style={styles.statusGrid}>
                {STATUS_OPTIONS.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusChip,
                      {
                        backgroundColor: localFilters.status?.includes(status.value as any)
                          ? status.color + '20'
                          : COLORS.gray[100],
                      },
                    ]}
                    onPress={() => handleStatusToggle(status.value)}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: status.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusChipText,
                        localFilters.status?.includes(status.value as any) && {
                          color: status.color,
                          fontFamily: getFontFamily('semibold'),
                        },
                      ]}
                    >
                      {status.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tri */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trier par</Text>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.sortOption}
                  onPress={() => handleSortChange(option.value)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        localFilters.sortBy && localFilters.sortOrder &&
                        `${localFilters.sortBy}_${localFilters.sortOrder}` === option.value &&
                        styles.radioSelected,
                      ]}
                    >
                      {`${localFilters.sortBy}_${localFilters.sortOrder}` === option.value && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                    <Text style={styles.sortOptionText}>{option.label}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>{HISTORY_MESSAGES.reset}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <LinearGradient
                colors={[COLORS.primary.main, COLORS.primary.dark]}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>{HISTORY_MESSAGES.apply}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.white,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.gray[700],
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[900],
    padding: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dateButtonText: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  dateSeparator: {
    fontSize: 16,
    color: COLORS.gray[400],
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusChipText: {
    fontSize: 13,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[600],
  },
  sortOption: {
    paddingVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: COLORS.primary.main,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary.main,
  },
  sortOptionText: {
    fontSize: 14,
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray[800],
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontFamily: getFontFamily('medium'),
    color: COLORS.gray[600],
  },
  applyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontFamily: getFontFamily('semibold'),
    color: COLORS.white,
  },
});