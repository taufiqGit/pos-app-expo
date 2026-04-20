import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

type DiscountType = "percentage" | "fixed";

interface DiscountFormProps {
  subtotal: number;
  onApply: (discountAmount: number, discountLabel: string) => void;
  onCancel: () => void;
}

export default function DiscountForm({
  subtotal,
  onApply,
  onCancel,
}: DiscountFormProps) {
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [value, setValue] = useState("");

  const computedDiscount = (): number => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return 0;
    if (discountType === "percentage") {
      return Math.min((num / 100) * subtotal, subtotal);
    }
    return Math.min(num, subtotal);
  };

  const handleApply = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid Discount", "Please enter a valid discount value.");
      return;
    }
    if (discountType === "percentage" && num > 100) {
      Alert.alert("Invalid Discount", "Percentage cannot exceed 100%.");
      return;
    }
    const amount = computedDiscount();
    const label =
      discountType === "percentage" ? `${num}% off` : `$${num.toFixed(2)} off`;
    onApply(amount, label);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apply Discount</Text>

      {/* Type Toggle */}
      <View style={styles.toggleRow}>
        {(["percentage", "fixed"] as DiscountType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.toggleButton,
              discountType === type && styles.toggleButtonActive,
            ]}
            onPress={() => {
              setDiscountType(type);
              setValue("");
            }}
          >
            <Text
              style={[
                styles.toggleText,
                discountType === type && styles.toggleTextActive,
              ]}
            >
              {type === "percentage" ? "% Percentage" : "$ Fixed Amount"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <Text style={styles.inputPrefix}>
          {discountType === "percentage" ? "%" : "$"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={discountType === "percentage" ? "e.g. 10" : "e.g. 5.00"}
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={setValue}
        />
      </View>

      {/* Preview */}
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>Discount Amount</Text>
        <Text style={styles.previewValue}>
          -${computedDiscount().toFixed(2)}
        </Text>
      </View>
      <View style={styles.previewRow}>
        <Text style={styles.previewLabel}>New Total</Text>
        <Text style={styles.previewTotal}>
          ${(subtotal - computedDiscount()).toFixed(2)}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  toggleButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  toggleText: {
    color: "#9ca3af",
    fontWeight: "600",
    fontSize: 14,
  },
  toggleTextActive: {
    color: "#ffffff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    paddingHorizontal: 14,
  },
  inputPrefix: {
    color: "#6366f1",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#f9fafb",
    fontSize: 18,
    paddingVertical: 12,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  previewLabel: {
    color: "#9ca3af",
    fontSize: 14,
  },
  previewValue: {
    color: "#f87171",
    fontSize: 14,
    fontWeight: "600",
  },
  previewTotal: {
    color: "#34d399",
    fontSize: 16,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
  },
  cancelText: {
    color: "#9ca3af",
    fontWeight: "600",
    fontSize: 15,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#6366f1",
    alignItems: "center",
  },
  applyText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});
