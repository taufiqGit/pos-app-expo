import { useFocusEffect, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ArrowLeft, Banknote, CreditCard, Wallet, type LucideIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NumPad from "@/components/pos/NumPad";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { useCart } from "@/hooks/useCart";
import { usePayment } from "@/hooks/usePayment";
import { useCheckoutStore, type CheckoutMethod } from "@/store/checkoutStore";
import { useOutletStore } from "@/store/outletStore";
import { useShiftStore } from "@/store/shiftStore";
import { buildSalePayload, createSale } from "@/services/salesService";
import { colors, motion, radius, spacing } from "@/theme";
import { formatRupiah } from "@/utils/format";

interface MethodOption {
  key: CheckoutMethod;
  label: string;
  hint: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const METHOD_OPTIONS: MethodOption[] = [
  { key: "cash", label: "Tunai (Cash)", hint: "Bayar di kasir", Icon: Banknote, iconBg: colors.primary, iconColor: colors.white },
  { key: "card", label: "Kartu Debit/Kredit", hint: "Visa, Mastercard, GPN", Icon: CreditCard, iconBg: colors.infoBg, iconColor: colors.info },
  { key: "ewallet", label: "E-Wallet / QRIS", hint: "OVO, Dana, ShopeePay", Icon: Wallet, iconBg: colors.purpleBg, iconColor: colors.purple },
];

/** Metode Pembayaran — kasir-pay.html */
export default function PaymentScreen() {
  const router = useRouter();
  const { items, itemCount, subtotal, discountAmount, taxAmount, total, isEmpty } = useCart();
  const { orderId, paymentMethod, setPaymentMethod, setReceipt } = useCheckoutStore();
  const selectedOutlet = useOutletStore((s) => s.selectedOutlet);
  const { processPayment, isProcessing } = usePayment();

  const [amountDigits, setAmountDigits] = useState("");

  // Guard: cart kosong → balik ke kasir
  useFocusEffect(
    React.useCallback(() => {
      if (isEmpty) {
        router.replace("/(tabs)/cashier");
      }
    }, [isEmpty, router]),
  );

  const tendered = amountDigits ? Number(amountDigits) : 0;
  const change = Math.max(0, tendered - total);
  const isCash = paymentMethod === "cash";
  const canConfirm = !isCash || tendered >= total;

  const handleNumPress = (digit: string) => {
    setAmountDigits((prev) => (prev.length >= 9 ? prev : prev + digit));
  };

  const handleBackspace = () => {
    setAmountDigits((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmountDigits("");
  };

  const handleExactAmount = () => {
    setAmountDigits(String(total));
  };

  const handleConfirm = async () => {
    if (!selectedOutlet) {
      Alert.alert("Outlet belum dipilih", "Pilih outlet terlebih dahulu sebelum transaksi.");
      return;
    }

    // Wajib shift aktif sebelum penjualan
    const shift = await useShiftStore.getState().refreshStatus();
    if (!shift) {
      Alert.alert(
        "Shift belum dimulai",
        "Mulai shift kasir terlebih dahulu sebelum melakukan penjualan.",
        [{ text: "OK", onPress: () => router.replace("/(tabs)/cashier") }],
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await processPayment({
      method: isCash ? "cash" : paymentMethod === "card" ? "card" : "wallet",
      amount: total,
      tendered: isCash ? tendered : undefined,
      reference: orderId ?? undefined,
    });
    if (!result.success) {
      Alert.alert("Pembayaran gagal", "Terjadi kesalahan saat memproses pembayaran.");
      return;
    }

    // Kirim transaksi ke backend — qty dalam satuan terpilih, base_quantity
    // dihitung ulang server-side dari conversion_factor.
    try {
      const payload = buildSalePayload(
        selectedOutlet.id,
        paymentMethod,
        isCash ? tendered : total,
        items,
      );
      const sale = await createSale(payload);

      setReceipt({
        orderId: sale.id,
        date: sale.created_at ?? new Date().toISOString(),
        items,
        itemCount,
        subtotal,
        discount: discountAmount,
        tax: taxAmount,
        total,
        method: paymentMethod,
        tendered: isCash ? tendered : undefined,
        change: result.change || undefined,
      });
      router.replace("/kasir/success");
    } catch (err: any) {
      const message = err?.message ?? "Gagal menyimpan transaksi";
      Alert.alert("Transaksi gagal", message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <ArrowLeft size={20} color={colors.textSecondary} />
        </Pressable>
        <View>
          <ThemedText variant="lg" weight="bold" color="ink">
            Metode Pembayaran
          </ThemedText>
          {orderId ? (
            <ThemedText variant="micro" color="textSecondary">
              Order ID #{orderId}
            </ThemedText>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Total summary — kartu gelap */}
        <View style={styles.totalCard}>
          <ThemedText variant="micro" weight="bold" color="muted" uppercase>
            Total Yang Harus Dibayar
          </ThemedText>
          <View style={styles.totalRow}>
            <ThemedText variant="hero" weight="bold" color="white">
              {formatRupiah(total)}
            </ThemedText>
            <View style={styles.itemsPill}>
              <ThemedText variant="micro" color="white">
                {itemCount} Items
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Pilihan metode */}
        <ThemedText variant="xs" weight="bold" color="textSecondary" style={styles.sectionLabel}>
          Pilih Metode
        </ThemedText>
        <View style={styles.methods}>
          {METHOD_OPTIONS.map(({ key, label, hint, Icon, iconBg, iconColor }) => {
            const active = paymentMethod === key;
            return (
              <Pressable
                key={key}
                onPress={() => setPaymentMethod(key)}
                accessibilityRole="radio"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [
                  styles.methodOption,
                  active && styles.methodOptionActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.methodInfo}>
                  <View style={[styles.methodIcon, { backgroundColor: iconBg }]}>
                    <Icon size={22} color={iconColor} />
                  </View>
                  <View>
                    <ThemedText variant="sm" weight="bold" color="ink">
                      {label}
                    </ThemedText>
                    <ThemedText variant="micro" color="textSecondary">
                      {hint}
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active ? <View style={styles.radioDot} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Panel uang tunai */}
        {isCash ? (
          <Card padding="lg">
            <View style={styles.cashHeader}>
              <ThemedText variant="xs" weight="bold" color="ink">
                Uang Diterima
              </ThemedText>
              <Pressable onPress={handleExactAmount} accessibilityRole="button" accessibilityLabel="Uang pas">
                <ThemedText variant="micro" weight="bold" color="primary">
                  UANG PAS
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.amountDisplay}>
              <ThemedText variant="lg" weight="bold" color="muted">
                Rp
              </ThemedText>
              <ThemedText variant="lg" weight="bold" color="ink" style={styles.amountValue}>
                {tendered ? formatRupiah(tendered).replace("Rp ", "") : "0"}
              </ThemedText>
            </View>
            <View style={styles.numpadWrap}>
              <NumPad
                onPress={handleNumPress}
                onBackspace={handleBackspace}
                onClear={handleClear}
                showDecimal={false}
                showClear
              />
            </View>
            <View style={styles.changeRow}>
              <ThemedText variant="micro" color="muted">
                Kembalian
              </ThemedText>
              <ThemedText variant="sm" weight="bold" color={change > 0 ? "success" : "muted"}>
                {formatRupiah(change)}
              </ThemedText>
            </View>
          </Card>
        ) : null}
      </ScrollView>

      {/* CTA bawah */}
      <View style={styles.footer}>
        <Button
          label="Konfirmasi Pembayaran"
          variant="primary"
          size="lg"
          fullWidth
          loading={isProcessing}
          disabled={isEmpty || !canConfirm}
          onPress={handleConfirm}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: spacing.screen,
    gap: spacing.lg,
  },

  // Kartu total gelap
  totalCard: {
    backgroundColor: colors.ink,
    borderRadius: radius.hero,
    padding: spacing.xxl,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: spacing.xs,
  },
  itemsPill: {
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
  },

  // Metode
  sectionLabel: {
    marginLeft: spacing.xs,
  },
  methods: {
    gap: spacing.md,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: "transparent",
    padding: spacing.card,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  methodOptionActive: {
    borderColor: colors.primary,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    flex: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.faint,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },

  // Panel tunai
  cashHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  amountDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  amountValue: {
    flex: 1,
    textAlign: "right",
  },
  numpadWrap: {
    marginBottom: spacing.md,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },

  footer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },
});
