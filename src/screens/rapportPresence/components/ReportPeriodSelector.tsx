import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { REPORT_PERIODS } from "../constants/report.constants";
import { ReportPeriod, ReportPeriodSelectorProps } from "../types/report.types";

let DateTimePicker: any = null;

try {
  DateTimePicker = require("@react-native-community/datetimepicker").default;
} catch (e) {
  console.warn("DateTimePicker non disponible");
}

export const ReportPeriodSelector: React.FC<ReportPeriodSelectorProps> = ({
  period,
  onPeriodChange,
  onDateRangeChange,
  startDate,
  endDate,
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  const getPeriodLabel = (p: ReportPeriod): string => {
    return REPORT_PERIODS.find((item) => item.value === p)?.label || p;
  };

  const handlePeriodSelect = (value: ReportPeriod) => {
    onPeriodChange(value);
    setShowPeriodModal(false);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);

    if (selectedDate) {
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        if (onDateRangeChange) {
          onDateRangeChange(dateStr, endDate || "");
        }
      } catch (error) {
        console.error("Erreur formatage date:", error);
        Alert.alert("Erreur", "Date invalide");
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);

    if (selectedDate) {
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        if (onDateRangeChange) {
          onDateRangeChange(startDate || "", dateStr);
        }
      } catch (error) {
        console.error("Erreur formatage date:", error);
        Alert.alert("Erreur", "Date invalide");
      }
    }
  };

  const handleCustomPeriodPress = () => {
    if (!DateTimePicker) {
      Alert.alert(
        "Information",
        "La sélection de date personnalisée n'est pas disponible sur cette plateforme.\nVeuillez utiliser les périodes prédéfinies.",
        [{ text: "OK" }],
      );
      return;
    }
    setShowStartPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorRow}>
        <TouchableOpacity
          style={styles.periodButton}
          onPress={() => setShowPeriodModal(true)}
        >
          <Ionicons name="calendar" size={18} color={COLORS.primary.main} />
          <Text style={styles.periodText}>{getPeriodLabel(period)}</Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.gray[400]} />
        </TouchableOpacity>

        {period === "custom" && (
          <View style={styles.dateRangeContainer}>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={handleCustomPeriodPress}
            >
              <Text style={styles.dateText}>{startDate || "Début"}</Text>
            </TouchableOpacity>
            <Text style={styles.dateSeparator}>→</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndPicker(true)}
            >
              <Text style={styles.dateText}>{endDate || "Fin"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal période */}
      <Modal
        visible={showPeriodModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPeriodModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPeriodModal(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={[COLORS.primary.light, COLORS.white]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Choisir la période</Text>
            </LinearGradient>

            {REPORT_PERIODS.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  period === item.value && styles.modalItemSelected,
                ]}
                onPress={() => handlePeriodSelect(item.value)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    period === item.value && styles.modalItemTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
                {period === item.value && (
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={COLORS.primary.main}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DatePicker avec vérification */}
      {showStartPicker && DateTimePicker && (
        <DateTimePicker
          value={(() => {
            try {
              return startDate ? new Date(startDate) : new Date();
            } catch {
              return new Date();
            }
          })()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && DateTimePicker && (
        <DateTimePicker
          value={(() => {
            try {
              return endDate ? new Date(endDate) : new Date();
            } catch {
              return new Date();
            }
          })()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  periodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    gap: 6,
  },
  periodText: {
    fontSize: 14,
    fontFamily: getFontFamily("medium"),
    color: COLORS.gray[700],
  },
  dateRangeContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  dateText: {
    fontSize: 12,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
    textAlign: "center",
  },
  dateSeparator: {
    fontSize: 14,
    color: COLORS.gray[400],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  modalHeader: {
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
    textAlign: "center",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  modalItemSelected: {
    backgroundColor: COLORS.primary.light,
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[800],
  },
  modalItemTextSelected: {
    color: COLORS.primary.main,
    fontFamily: getFontFamily("semibold"),
  },
});