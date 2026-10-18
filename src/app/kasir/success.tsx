import { useFocusEffect, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, Printer, Wallet } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { useCart } from "@/hooks/useCart";
import { useCheckoutStore } from "@/store/checkoutStore";
import { colors, radius, spacing } from "@/theme";
import { formatQty, formatRupiah } from "@/utils/format";

const METHOD_LABELS = {
  cash: "Tunai (Cash)",
  card: "Kartu Debit/Kredit",
  ewallet: "E-Wallet / QRIS",
} as const;

/** Order Successful — kasir-order-confirm.html */
export default function SuccessScreen() {
  const router = useRouter();
  const receipt = useCheckoutStore((s) => s.receipt);
  const { clearCart } = useCart();

  useFocusEffect(
    React.useCallback(() => {
      // Guard: tidak ada receipt → bukan dari pembayaran, balik ke kasir
      if (!receipt) {
        router.replace("/(tabs)/cashier");
        return;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, [receipt, router]),
  );

  if (!receipt) return null;

  const MethodIcon = receipt.method === "cash" ? Banknote : receipt.method === "card" ? CreditCard : Wallet;

  const handlePrint = () => {
    // TODO: integrasi printer bluetooth / e-receipt
  };

  const handleNewOrder = () => {
    clearCart();
    useCheckoutStore.getState().reset();
    router.replace("/(tabs)/cashier");
  };

  const dateLabel = new Date(receipt.date).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleNewOrder}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke kasir"
          hitSlop={8}
        >
          <ArrowLeft size={22} color={colors.ink} />
        </Pressable>
        <ThemedText variant="lg" weight="bold" color="ink" style={styles.headerTitle}>
          Order Successful
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.center}>
          {/* Icon sukses */}
          <View style={styles.successIcon}>
            <CheckCircle2 size={48} color={colors.success} />
          </View>

          <ThemedText variant="xxl" weight="bold" color="ink">
            Payment Success!
          </ThemedText>
          <ThemedText variant="sm" color="textSecondary" style={styles.subtitle}>
            Transaksi berhasil diproses.
          </ThemedText>
        </View>

        {/* Receipt card */}
        <View style={styles.receipt}>
          {/* Cutout dekoratif sisi kiri-kanan */}
          <View style={[styles.cutout, styles.cutoutLeft]} />
          <View style={[styles.cutout, styles.cutoutRight]} />

          <View style={styles.receiptHeader}>
            <View>
              <ThemedText variant="micro" weight="bold" color="muted" uppercase>
                Order Number
              </ThemedText>
              <ThemedText variant="lg" weight="bold" color="ink">
                #{receipt.orderId}
              </ThemedText>
            </View>
            <View style={styles.receiptHeaderRight}>
              <ThemedText variant="micro" weight="bold" color="muted" uppercase>
                Date
              </ThemedText>
              <ThemedText variant="xs" color="ink">
                {dateLabel}
              </ThemedText>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          {/* Items */}
          <View style={styles.itemsList}>
            {receipt.items.map((item) => (
              <View key={item.id} style={styles.receiptItem}>
                <View style={styles.receiptItemInfo}>
                  <View style={styles.qtyChip}>
                    <ThemedText variant="micro" weight="bold" color="textSecondary">
                      {formatQty(item.quantity)}
                      {item.unitLabel ? ` ${item.unitLabel}` : "x"}
                    </ThemedText>
                  </View>
                  <ThemedText variant="sm" color="ink" numberOfLines={1} style={styles.itemName}>
                    {item.name}
                  </ThemedText>
                </View>
                <ThemedText variant="sm" weight="bold" color="ink">
                  {formatRupiah(item.price * item.quantity)}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={styles.dashedDivider} />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <ThemedText variant="xs" color="textSecondary">
                Subtotal
              </ThemedText>
              <ThemedText variant="xs" color="ink">
                {formatRupiah(receipt.subtotal)}
              </ThemedText>
            </View>
            {receipt.discount > 0 ? (
              <View style={styles.summaryRow}>
                <ThemedText variant="xs" color="textSecondary">
                  Discount
                </ThemedText>
                <ThemedText variant="xs" color="ink">
                  -{formatRupiah(receipt.discount)}
                </ThemedText>
              </View>
            ) : null}
            <View style={styles.summaryRow}>
              <ThemedText variant="xs" color="textSecondary">
                Tax
              </ThemedText>
              <ThemedText variant="xs" color="ink">
                {receipt.tax > 0 ? formatRupiah(receipt.tax) : "Free"}
              </ThemedText>
            </View>
            {receipt.method === "cash" && receipt.change !== undefined ? (
              <View style={styles.summaryRow}>
                <ThemedText variant="xs" color="textSecondary">
                  Kembalian
                </ThemedText>
                <ThemedText variant="xs" color="success">
                  {formatRupiah(receipt.change)}
                </ThemedText>
              </View>
            ) : null}
            <View style={styles.totalRow}>
              <ThemedText variant="lg" weight="bold" color="ink">
                Total
              </ThemedText>
              <ThemedText variant="lg" weight="bold" color="primary">
                {formatRupiah(receipt.total)}
              </ThemedText>
            </View>
          </View>

          {/* Metode pembayaran */}
          <View style={styles.methodTag}>
            <View style={styles.methodTagInfo}>
              <View style={styles.methodTagIcon}>
                <MethodIcon size={16} color={colors.white} />
              </View>
              <View>
                <ThemedText variant="micro" weight="bold" color="muted" uppercase>
                  Payment Method
                </ThemedText>
                <ThemedText variant="xs" weight="bold" color="ink">
                  {METHOD_LABELS[receipt.method]}
                </ThemedText>
              </View>
            </View>
            <CheckCircle2 size={20} color={colors.success} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button label="Print Receipt" icon={Printer} variant="dark" size="lg" fullWidth onPress={handlePrint} />
          <Button label="Start New Order" variant="white" size="lg" fullWidth onPress={handleNewOrder} />
        </View>
      </ScrollView>
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
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    backgroundColor: colors.card,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  headerTitle: {
    marginLeft: spacing.sm,
  },
  content: {
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  center: {
    alignItems: "center",
    paddingTop: spacing.xxl,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
  },

  // Receipt
  receipt: {
    backgroundColor: colors.card,
    borderRadius: radius.hero,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: "hidden",
  },
  cutout: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.bg,
    top: "50%",
    marginTop: -12,
  },
  cutoutLeft: {
    left: -12,
  },
  cutoutRight: {
    right: -12,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.xxl,
  },
  receiptHeaderRight: {
    alignItems: "flex-end",
  },
  dashedDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.lineStrong,
    borderStyle: "dashed",
    marginBottom: spacing.xxl,
  },
  itemsList: {
    gap: spacing.lg,
    marginBottom: 0,
  },
  receiptItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  receiptItemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    marginRight: spacing.md,
  },
  qtyChip: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  itemName: {
    flexShrink: 1,
  },
  summary: {
    gap: spacing.xs,
    marginBottom: spacing.xxl,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  methodTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.orangeBg,
    borderRadius: radius.lg,
    padding: spacing.card,
  },
  methodTagInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  methodTagIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
