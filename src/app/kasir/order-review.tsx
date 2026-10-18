import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QtyStepper } from "@/components/pos/QtyStepper";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/ThemedText";
import { useCart } from "@/hooks/useCart";
import { useCheckoutStore } from "@/store/checkoutStore";
import { colors, motion, radius, spacing } from "@/theme";
import { formatQty, formatRupiah } from "@/utils/format";

/** Order Review — kasir-order.html */
export default function OrderReviewScreen() {
  const router = useRouter();
  const { items, itemCount, subtotal, discountAmount, taxAmount, total, isEmpty, updateQuantity } = useCart();
  const resetCheckout = useCheckoutStore((s) => s.reset);

  // Guard: cart kosong → balik ke kasir
  useFocusEffect(
    React.useCallback(() => {
      if (isEmpty) {
        router.replace("/(tabs)/cashier");
      }
    }, [isEmpty, router]),
  );

  const handleProceed = () => {
    // Reset checkout state dari transaksi sebelumnya, lalu generate order ID baru
    resetCheckout();
    const orderId = `TRX-${Date.now().toString().slice(-5)}`;
    useCheckoutStore.getState().setOrderId(orderId);
    router.push("/kasir/payment");
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
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <ThemedText variant="lg" weight="bold" color="ink">
          Order Review
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Item cards */}
        {items.map((item) => (
          <Card key={item.id} style={styles.itemCard}>
            <View style={styles.itemRow}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
              ) : (
                <View style={[styles.itemImage, styles.imagePlaceholder]}>
                  <ThemedText variant="xl" weight="bold" color="faint">
                    {item.name.charAt(0).toUpperCase()}
                  </ThemedText>
                </View>
              )}
              <View style={styles.itemInfo}>
                <ThemedText variant="sm" weight="bold" color="ink" numberOfLines={2}>
                  {item.name}
                </ThemedText>
                <ThemedText variant="micro" color="muted" numberOfLines={1} style={styles.itemSubtitle}>
                  {item.unitLabel
                    ? `${formatQty(item.quantity)} ${item.unitLabel}`
                    : item.sku
                      ? `SKU: ${item.sku}`
                      : item.name}
                  {item.unitLabel && item.baseQty !== undefined
                    ? ` • = ${formatQty(item.baseQty)}`
                    : ""}
                </ThemedText>
                <View style={styles.itemFooter}>
                  <ThemedText variant="sm" weight="bold" color="primary">
                    {formatRupiah(item.price * item.quantity)}
                  </ThemedText>
                  <QtyStepper
                    value={item.quantity}
                    onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                    onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                  />
                </View>
              </View>
            </View>
          </Card>
        ))}

        {/* Order Summary */}
        <Card padding="lg" style={styles.summaryCard}>
          <ThemedText variant="sm" weight="bold" color="ink" style={styles.summaryTitle}>
            Order Summary
          </ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText variant="xs" color="muted">
              Item total ({itemCount})
            </ThemedText>
            <ThemedText variant="xs" weight="semiBold" color="ink">
              {formatRupiah(subtotal)}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText variant="xs" color="muted">
              Discount
            </ThemedText>
            <ThemedText variant="xs" weight="semiBold" color={discountAmount > 0 ? "dangerText" : "ink"}>
              {discountAmount > 0 ? `-${formatRupiah(discountAmount)}` : "—"}
            </ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText variant="xs" color="muted">
              Tax
            </ThemedText>
            <ThemedText variant="xs" weight="semiBold" color="ink">
              {taxAmount > 0 ? formatRupiah(taxAmount) : "Free"}
            </ThemedText>
          </View>
          <View style={styles.totalRow}>
            <ThemedText variant="sm" weight="bold" color="ink">
              Total
            </ThemedText>
            <ThemedText variant="lg" weight="bold" color="primary">
              {formatRupiah(total)}
            </ThemedText>
          </View>
        </Card>

        {/* CTA */}
        <Button
          label="Proceed Transactions"
          variant="dark"
          size="lg"
          fullWidth
          disabled={isEmpty}
          onPress={handleProceed}
        />
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
    gap: spacing.md,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  backButton: {
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    padding: spacing.screen,
    paddingBottom: spacing.xxxl + 40,
    gap: spacing.lg,
  },
  itemCard: {
    padding: spacing.card,
  },
  itemRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: radius.lg,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  itemInfo: {
    flex: 1,
  },
  itemSubtitle: {
    marginBottom: spacing.sm,
  },
  itemFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryCard: {
    marginTop: spacing.xs,
  },
  summaryTitle: {
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs + 2,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderStyle: "dashed",
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },
});
