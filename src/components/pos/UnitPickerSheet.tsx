import * as Haptics from "expo-haptics";
import { X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import NumPad from "@/components/pos/NumPad";
import { QtyStepper } from "@/components/pos/QtyStepper";
import Button from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, motion, radius, spacing } from "@/theme";
import {
  Product,
  ProductUnit,
  resolveUnitPrice,
  toBaseQty,
} from "@/types";
import { formatQty, formatRupiah } from "@/utils/format";

interface UnitPickerSheetProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
  /** Dipanggil dengan satuan terpilih + qty (dalam satuan tsb) */
  onConfirm: (product: Product, unit: ProductUnit | undefined, quantity: number) => void;
}

/** Opsi satuan di sheet: base unit + product_units */
type UnitOption = { unit?: ProductUnit; label: string };

interface SheetContentProps {
  product: Product;
  onClose: () => void;
  /** Dipanggil dengan satuan terpilih + qty (dalam satuan tsb) */
  onConfirm: (product: Product, unit: ProductUnit | undefined, quantity: number) => void;
}

/**
 * Konten sheet. Diremount tiap dibuka / ganti produk (via conditional render
 * di parent) sehingga state pilihan & qty ter-reset otomatis.
 */
function SheetContent({ product, onClose, onConfirm }: SheetContentProps) {
  const [selected, setSelected] = useState<UnitOption | null>(null);
  const [stepperQty, setStepperQty] = useState(1);
  /** digit NumPad untuk qty desimal, mis. "1.75" */
  const [qtyDigits, setQtyDigits] = useState("");

  const options: UnitOption[] = useMemo(() => {
    const list: UnitOption[] = [{ label: `Base (${product.baseUnit ?? "unit"})` }];
    return [...list, ...(product.productUnits ?? []).map((unit) => ({ unit, label: unit.label }))];
  }, [product]);

  const weighable = selected?.unit?.is_weighable === true;
  const decimalQty = qtyDigits ? Number(qtyDigits) : 0;
  const quantity = weighable ? decimalQty : stepperQty;
  const canConfirm = weighable ? decimalQty > 0 : stepperQty > 0;
  const unitPrice = selected ? resolveUnitPrice(product, selected.unit) : product.price;
  const baseQty = selected ? toBaseQty(quantity, selected.unit) : quantity;

  const handleNumPress = (digit: string) => {
    // maks 3 desimal
    const [, decimals] = qtyDigits.split(".");
    if (decimals && decimals.length >= 3) return;
    setQtyDigits((prev) => (prev + digit).replace(/^0(\d)/, "$1"));
  };

  const handleBackspace = () => {
    setQtyDigits((prev) => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm(product, selected?.unit, quantity);
    onClose();
  };

  return (
    <>
      {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <ThemedText variant="base" weight="bold" color="ink" numberOfLines={1}>
                {product.name}
              </ThemedText>
              <ThemedText variant="micro" color="textSecondary">
                Pilih satuan dan jumlah
              </ThemedText>
            </View>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Tutup" style={styles.closeButton}>
              <X size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Daftar satuan */}
            {options.map((option) => {
              const active = selected?.label === option.label;
              const price = resolveUnitPrice(product, option.unit);
              return (
                <Pressable
                  key={option.label}
                  onPress={() => setSelected(option)}
                  accessibilityRole="radio"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.unitRow,
                    active && styles.unitRowActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.unitInfo}>
                    <ThemedText variant="sm" weight="bold" color="ink">
                      {option.label}
                    </ThemedText>
                    {option.unit ? (
                      <ThemedText variant="micro" color="textSecondary">
                        = {formatQty(option.unit.conversion_factor)} {product.baseUnit ?? "unit"}
                      </ThemedText>
                    ) : null}
                  </View>
                  <ThemedText variant="sm" weight="bold" color="primary">
                    {formatRupiah(price)}
                  </ThemedText>
                </Pressable>
              );
            })}

            {/* Qty input untuk satuan terpilih */}
            {selected ? (
              <View style={styles.qtySection}>
                <ThemedText variant="xs" weight="bold" color="ink">
                  Jumlah ({selected.label})
                </ThemedText>
                {weighable ? (
                  <>
                    <View style={styles.qtyDisplay}>
                      <ThemedText variant="lg" weight="bold" color={decimalQty > 0 ? "ink" : "muted"}>
                        {qtyDigits || "0"}
                      </ThemedText>
                      <ThemedText variant="xs" color="textSecondary">
                        = {formatQty(baseQty)} {product.baseUnit ?? "unit"}
                      </ThemedText>
                    </View>
                    <NumPad
                      onPress={handleNumPress}
                      onBackspace={handleBackspace}
                      showDecimal
                      showClear
                      onClear={() => setQtyDigits("")}
                    />
                  </>
                ) : (
                  <QtyStepper value={stepperQty} onDecrement={() => setStepperQty((q) => Math.max(1, q - 1))} onIncrement={() => setStepperQty((q) => q + 1)} />
                )}
              </View>
            ) : null}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <View>
              <ThemedText variant="micro" color="textSecondary">
                Subtotal
              </ThemedText>
              <ThemedText variant="sm" weight="bold" color="ink">
                {formatRupiah(unitPrice * quantity)}
              </ThemedText>
            </View>
            <Button
              label="Tambah ke Keranjang"
              variant="primary"
              size="md"
              disabled={!canConfirm}
              onPress={handleConfirm}
            />
          </View>
    </>
  );
}

export function UnitPickerSheet({ product, visible, onClose, onConfirm }: UnitPickerSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} accessibilityLabel="Tutup" />
        <View style={styles.sheet}>
          {visible && product ? (
            <SheetContent product={product} onClose={onClose} onConfirm={onConfirm} />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropTouch: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  headerInfo: {
    flex: 1,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.card,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: colors.bg,
  },
  unitRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  unitInfo: {
    flexShrink: 1,
  },
  qtySection: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  qtyDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.inputBg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },
});
