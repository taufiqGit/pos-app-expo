import { Minus, Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, radius } from "@/theme";

interface QtyStepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  /** Minus dinonaktifkan saat value <= minValue */
  minValue?: number;
}

/** Stepper kuantitas gaya Order Review (kasir-order.html). */
export function QtyStepper({ value, onDecrement, onIncrement, minValue = 1 }: QtyStepperProps) {
  const minusDisabled = value <= minValue;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDecrement}
        disabled={minusDisabled}
        accessibilityRole="button"
        accessibilityLabel="Kurangi jumlah"
        accessibilityState={{ disabled: minusDisabled }}
        style={({ pressed }) => [
          styles.button,
          styles.minusButton,
          minusDisabled && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
      >
        <Minus size={14} color={colors.textSecondary} strokeWidth={2.6} />
      </Pressable>

      <ThemedText variant="xs" weight="bold" color="ink" style={styles.value}>
        {value}
      </ThemedText>

      <Pressable
        onPress={onIncrement}
        accessibilityRole="button"
        accessibilityLabel="Tambah jumlah"
        style={({ pressed }) => [styles.button, styles.plusButton, pressed && styles.buttonPressed]}
      >
        <Plus size={14} color={colors.white} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    padding: 4,
    gap: 12,
  },
  button: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  minusButton: {
    backgroundColor: colors.card,
  },
  plusButton: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  value: {
    minWidth: 16,
    textAlign: "center",
  },
});
