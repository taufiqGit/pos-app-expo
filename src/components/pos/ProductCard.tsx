import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, motion, radius, shadows, spacing } from "@/theme";
import { type Product, resolveUnitPrice } from "@/types";
import { formatRupiah } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  /** Dipanggil saat card atau tombol + ditekan */
  onAdd: (product: Product) => void;
  style?: ViewStyle;
}

/** Card produk gaya kasir.html — putih, radius 24, gambar, harga orange, tombol + dark. */
export function ProductCard({ product, onAdd, style }: ProductCardProps) {
  const outOfStock = product.stock !== undefined && product.stock <= 0;
  /** Satuan default (is_default) dipakai sebagai harga utama card; kosong = base unit */
  const defaultUnit = product.productUnits?.find((u) => u.is_default);
  const displayPrice = resolveUnitPrice(product, defaultUnit);
  const extraUnits = product.productUnits?.length ?? 0;

  const handleAdd = () => {
    if (!outOfStock) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onAdd(product);
    }
  };

  return (
    <Pressable
      onPress={handleAdd}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatRupiah(product.price)}${outOfStock ? ", stok habis" : ""}`}
      accessibilityState={{ disabled: outOfStock }}
      style={({ pressed }) => [
        styles.card,
        outOfStock && styles.cardDisabled,
        pressed && styles.cardPressed,
        style,
      ]}
    >
      {product.discount ? (
        <View style={styles.discountBadge}>
          <ThemedText variant="micro" weight="bold" color="white">
            -{product.discount}%
          </ThemedText>
        </View>
      ) : null}

      {extraUnits > 0 ? (
        <View style={styles.unitBadge}>
          <ThemedText variant="micro" weight="bold" color="white">
            +{extraUnits} satuan
          </ThemedText>
        </View>
      ) : null}

      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="cover"
          transition={motion.fadeDuration}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <ThemedText
            variant="hero"
            weight="bold"
            color="faint"
          >
            {product.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}

      <ThemedText variant="xs" weight="bold" color="ink" style={styles.name} numberOfLines={2}>
        {product.name}
      </ThemedText>

      {product.subtitle ? (
        <ThemedText variant="micro" color="muted" style={styles.subtitle} numberOfLines={1}>
          {product.subtitle}
        </ThemedText>
      ) : null}

      <View style={styles.footer}>
        <ThemedText variant="xs" weight="bold" color="primary" numberOfLines={1} style={styles.price}>
          {formatRupiah(displayPrice)}
        </ThemedText>
        <Pressable
          onPress={handleAdd}
          disabled={outOfStock}
          accessibilityRole="button"
          accessibilityLabel={`Tambah ${product.name} ke keranjang`}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
        >
          <Plus size={14} color={colors.white} strokeWidth={2.6} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.card,
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: motion.pressScale }],
  },
  cardDisabled: {
    opacity: 0.5,
  },
  discountBadge: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    zIndex: 1,
  },
  unitBadge: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
    zIndex: 1,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  name: {
    textAlign: "center",
    alignSelf: "stretch",
    marginBottom: 2,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginTop: "auto",
  },
  price: {
    flexShrink: 1,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScaleStrong }],
  },
});
