import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface SalesData {
  label: string;
  value: number;
}

interface SalesChartProps {
  data?: SalesData[];
  title?: string;
  color?: string;
}

const DEFAULT_DATA: SalesData[] = [
  { label: "Mon", value: 1200 },
  { label: "Tue", value: 1800 },
  { label: "Wed", value: 900 },
  { label: "Thu", value: 2400 },
  { label: "Fri", value: 2100 },
  { label: "Sat", value: 3200 },
  { label: "Sun", value: 1500 },
];

const CHART_HEIGHT = 160;

const SalesChart: React.FC<SalesChartProps> = ({
  data = DEFAULT_DATA,
  title = "Weekly Sales",
  color = "#6C63FF",
}) => {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.chartArea}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          {[maxValue, Math.round(maxValue / 2), 0].map((v, i) => (
            <Text key={i} style={styles.yLabel}>
              {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
            </Text>
          ))}
        </View>

        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const barHeightPercent = (item.value / maxValue) * 100;
            return (
              <View key={index} style={styles.barWrapper}>
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${barHeightPercent}%`,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            ${data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Total Sales</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            ${Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Avg / Day</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color }]}>
            ${Math.max(...data.map((d) => d.value)).toLocaleString()}
          </Text>
          <Text style={styles.summaryLabel}>Peak Day</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E1E2E",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  chartArea: {
    flexDirection: "row",
    height: CHART_HEIGHT,
    marginBottom: 12,
  },
  yAxis: {
    width: 40,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 6,
    paddingBottom: 20,
  },
  yLabel: {
    fontSize: 10,
    color: "#888",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  barBackground: {
    flex: 1,
    width: "60%",
    justifyContent: "flex-end",
    backgroundColor: "#2A2A3E",
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A3E",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#2A2A3E",
  },
});

export default SalesChart;
