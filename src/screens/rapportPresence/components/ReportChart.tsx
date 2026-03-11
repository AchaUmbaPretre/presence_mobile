import { getFontFamily } from "@/constants/typography";
import { COLORS } from "@/screens/dashboard/constants/color";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ReportChartProps } from "../types/report.types";

const { width } = Dimensions.get("window");

export const ReportChart: React.FC<ReportChartProps> = ({
  data,
  height = 200,
}) => {
  const chartConfig = {
    backgroundColor: COLORS.white,
    backgroundGradientFrom: COLORS.white,
    backgroundGradientTo: COLORS.gray[50],
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(10, 77, 164, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(75, 85, 99, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
    },
  };

  // ✅ Convertir les couleurs en fonctions
  const formattedDatasets = data.datasets.map((dataset, index) => {
    const colors = [
      COLORS.primary.main,
      COLORS.success.main,
      COLORS.warning.main,
      COLORS.error.main,
    ];
    const datasetColor = dataset.color || colors[index % colors.length];

    return {
      data: dataset.data,
      color: (opacity = 1) => {
        // Convertir la couleur hex en rgba
        const r = parseInt(datasetColor.slice(1, 3), 16);
        const g = parseInt(datasetColor.slice(3, 5), 16);
        const b = parseInt(datasetColor.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      },
      strokeWidth: 2,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Évolution des présences</Text>

      {/* Légende des datasets */}
      {data.datasets.length > 1 && (
        <View style={styles.legendContainer}>
          {data.datasets.map((dataset, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: dataset.color || COLORS.primary.main },
                ]}
              />
              <Text style={styles.legendText}>
                {dataset.label || `Série ${index + 1}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      <LineChart
        data={{
          labels: data.labels,
          datasets: formattedDatasets,
        }}
        width={width - 40}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        formatYLabel={(value) => Math.round(Number(value)).toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  title: {
    fontSize: 16,
    fontFamily: getFontFamily("semibold"),
    color: COLORS.gray[900],
    marginBottom: 12,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 11,
    fontFamily: getFontFamily("regular"),
    color: COLORS.gray[600],
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
