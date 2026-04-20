import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from "react-native";

interface NumPadProps {
  onPress: (value: string) => void;
  onBackspace: () => void;
  onClear?: () => void;
  showDecimal?: boolean;
  showClear?: boolean;
  disabled?: boolean;
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "⌫"],
];

const NumPad: React.FC<NumPadProps> = ({
  onPress,
  onBackspace,
  onClear,
  showDecimal = true,
  showClear = false,
  disabled = false,
}) => {
  const handleKeyPress = (key: string) => {
    if (disabled) return;
    Vibration.vibrate(30);

    if (key === "⌫") {
      onBackspace();
    } else if (key === "C") {
      onClear?.();
    } else {
      onPress(key);
    }
  };

  const renderKey = (key: string, rowIndex: number, colIndex: number) => {
    const isBackspace = key === "⌫";
    const isClear = key === "C";
    const isDecimal = key === ".";
    const isZero = key === "0";

    const isHidden = isDecimal && !showDecimal;
    const replacedWithClear = isDecimal && !showDecimal && showClear;

    const displayKey = replacedWithClear ? "C" : key;
    const actualKey = replacedWithClear ? "C" : key;

    if (isHidden && !showClear) {
      return <View key={`${rowIndex}-${colIndex}`} style={styles.keyPlaceholder} />;
    }

    return (
      <TouchableOpacity
        key={`${rowIndex}-${colIndex}`}
        style={[
          styles.key,
          isBackspace && styles.backspaceKey,
          (isClear || (replacedWithClear)) && styles.clearKey,
          disabled && styles.keyDisabled,
        ]}
        onPress={() => handleKeyPress(actualKey)}
        activeOpacity={0.6}
        disabled={disabled}
      >
        <Text
          style={[
            styles.keyText,
            isBackspace && styles.backspaceText,
            (isClear || replacedWithClear) && styles.clearText,
            disabled && styles.keyTextDisabled,
          ]}
        >
          {displayKey}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, colIndex) => renderKey(key, rowIndex, colIndex))}
        </View>
      ))}
    </View>
  );
};

export default NumPad;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  key: {
    flex: 1,
    marginHorizontal: 4,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  keyPlaceholder: {
    flex: 1,
    marginHorizontal: 4,
    height: 64,
  },
  backspaceKey: {
    backgroundColor: "#FEE2E2",
  },
  clearKey: {
    backgroundColor: "#FEF3C7",
  },
  keyDisabled: {
    opacity: 0.4,
  },
  keyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
  },
  backspaceText: {
    fontSize: 20,
    color: "#EF4444",
  },
  clearText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D97706",
  },
  keyTextDisabled: {
    color: "#9CA3AF",
  },
});
