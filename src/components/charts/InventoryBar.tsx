import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface InventoryBarProps {
  label?: string;
  value?: number;
  max?: number;
  color?: string;
}

const InventoryBar: React.FC<InventoryBarProps> = ({
  label = "Item",
  value = 0,
  max = 100,
  color = "#4A90E2",
}) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>
          {value} / {max}
        </Text>
      </View>
      <View style={styles.trackBackground}>
        <View
          style={[
            styles.trackFill,
            { width: `${percentage}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.percentageText}>{percentage.toFixed(1)}%</Text>
    </View>
  );
};

export default InventoryBar;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  valueText: {
    fontSize: 13,
    color: "#666",
  },
  trackBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    overflow: "hidden",
  },
  trackFill: {
    height: "100%",
    borderRadius: 6,
  },
  percentageText: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});
