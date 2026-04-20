import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

type PaymentMethod = "cash" | "card" | "qr";

interface PaymentFormProps {
  totalAmount: number;
  onPaymentSubmit?: (method: PaymentMethod, amount: number) => void;
  onCancel?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  totalAmount,
  onPaymentSubmit,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState<string>("");

  const change =
    selectedMethod === "cash"
      ? parseFloat(amountTendered || "0") - totalAmount
      : 0;

  const handleSubmit = () => {
    const tendered = parseFloat(amountTendered || "0");

    if (selectedMethod === "cash" && tendered < totalAmount) {
      Alert.alert("Insufficient Amount", "Tendered amount is less than total.");
      return;
    }

    onPaymentSubmit?.(selectedMethod, tendered);
  };

  const paymentMethods: { key: PaymentMethod; label: string }[] = [
    { key: "cash", label: "💵 Cash" },
    { key: "card", label: "💳 Card" },
    { key: "qr", label: "📱 QR Code" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Payment</Text>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
      </View>

      {/* Payment Method Selector */}
      <Text style={styles.sectionLabel}>Payment Method</Text>
      <View style={styles.methodRow}>
        {paymentMethods.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.methodButton,
              selectedMethod === key && styles.methodButtonActive,
            ]}
            onPress={() => setSelectedMethod(key)}
          >
            <Text
              style={[
                styles.methodButtonText,
                selectedMethod === key && styles.methodButtonTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cash Input */}
      {selectedMethod === "cash" && (
        <View style={styles.inputGroup}>
          <Text style={styles.sectionLabel}>Amount Tendered</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#888"
            keyboardType="decimal-pad"
            value={amountTendered}
            onChangeText={setAmountTendered}
          />
          {change >= 0 && amountTendered !== "" && (
            <View style={styles.changeRow}>
              <Text style={styles.changeLabel}>Change</Text>
              <Text style={styles.changeValue}>${change.toFixed(2)}</Text>
            </View>
          )}
        </View>
      )}

      {/* Card / QR placeholder */}
      {selectedMethod !== "cash" && (
        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            {selectedMethod === "card"
              ? "Insert or tap card to proceed"
              : "Scan QR code to complete payment"}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PaymentForm;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#1a1a2e",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#16213e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    color: "#aaaaaa",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4ecca3",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#aaaaaa",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#333",
    backgroundColor: "#16213e",
    alignItems: "center",
  },
  methodButtonActive: {
    borderColor: "#4ecca3",
    backgroundColor: "#0f3460",
  },
  methodButtonText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
  methodButtonTextActive: {
    color: "#4ecca3",
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#16213e",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#333",
    color: "#ffffff",
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  changeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 4,
  },
  changeLabel: {
    fontSize: 15,
    color: "#aaaaaa",
  },
  changeValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f9ca24",
  },
  placeholderBox: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#333",
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  placeholderText: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#2a2a3e",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#aaaaaa",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#4ecca3",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "700",
  },
});
