import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ReportStatsTableProps } from "../types/report.types";

export const ReportStatsTable: React.FC<ReportStatsTableProps> = ({
  data,
  onRowPress,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Détails quotidiens</Text>
        <TouchableOpacity>
          <Text style={styles.headerLink}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: 60 }]}>Date</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>P</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>A</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>R</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>C</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>M</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>Mal</Text>
          </View>

          {data.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}
              onPress={() => onRowPress?.(item)}
            >
              <Text style={[styles.cell, { width: 60 }]}>
                {formatDate(item.date)}
              </Text>
              <Text style={[styles.cell, styles.cellPresent, { width: 50 }]}>
                {item.present}
              </Text>
              <Text style={[styles.cell, styles.cellAbsent, { width: 50 }]}>
                {item.absent}
              </Text>
              <Text style={[styles.cell, styles.cellRetard, { width: 50 }]}>
                {item.retard}
              </Text>
              <Text style={[styles.cell, styles.cellConge, { width: 50 }]}>
                {item.conge}
              </Text>
              <Text style={[styles.cell, styles.cellMission, { width: 50 }]}>
                {item.mission}
              </Text>
              <Text style={[styles.cell, styles.cellMaladie, { width: 50 }]}>
                {item.maladie}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        colors={[COLORS.primary.light, COLORS.white]}
        style={styles.footer}
      >
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.success.main },
              ]}
            />
            <Text style={styles.legendText}>P: Présent</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: COLORS.error.main }]}
            />
            <Text style={styles.legendText}>A: Absent</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.warning.main },
              ]}
            />
            <Text style={styles.legendText}>R: Retard</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.primary.main },
              ]}
            />
            <Text style={styles.legendText}>C: Congé</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    COLORS.secondary?.main || COLORS.primary.main,
                },
              ]}
            />
            <Text style={styles.legendText}>M: Mission</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS.warning.dark },
              ]}
            />
            <Text style={styles.legendText}>Mal: Maladie</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
  },
  headerLink: {
    fontSize: 13,
    fontFamily: getFontFamily("medium"),
    color: COLORS.primary.main,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.gray[50],
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerCell: {
    fontSize: 12,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[600],
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  tableRowEven: {
    backgroundColor: COLORS.gray[50],
  },
  cell: {
    fontSize: 13,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[800],
    textAlign: "center",
  },
  cellPresent: {
    color: COLORS.success.main,
    fontFamily: getFontFamily("semibold"),
  },
  cellAbsent: {
    color: COLORS.error.main,
    fontFamily: getFontFamily("semibold"),
  },
  cellRetard: {
    color: COLORS.warning.main,
    fontFamily: getFontFamily("semibold"),
  },
  cellConge: {
    color: COLORS.primary.main,
  },
  cellMission: {
    color: COLORS.secondary?.main || COLORS.primary.main,
  },
  cellMaladie: {
    color: COLORS.warning.dark,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
  },
});
