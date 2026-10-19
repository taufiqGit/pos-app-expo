import { useFocusEffect, useRouter } from "expo-router";
import { ArrowRight, PackageSearch, Search } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCard } from "@/components/pos/ProductCard";
import { UnitPickerSheet } from "@/components/pos/UnitPickerSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemedText } from "@/components/ui/ThemedText";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/authStore";
import { useOutletStore } from "@/store/outletStore";
import { useShiftStore } from "@/store/shiftStore";
import { colors, motion, radius, shadows, spacing } from "@/theme";
import type { Product } from "@/types";
import { formatRupiah } from "@/utils/format";

interface CategoryPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function CategoryPill({ label, active, onPress }: CategoryPillProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [
        styles.pill,
        active ? styles.pillActive : styles.pillInactive,
        pressed && styles.pillPressed,
      ]}
    >
      <ThemedText variant="xs" weight="semiBold" color={active ? "onPrimary" : "textSecondary"}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function CashierScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const selectedOutlet = useOutletStore((s) => s.selectedOutlet);

  const { filteredProducts, categories, loading: productsLoading, error: productsError, searchQuery, searchProducts, selectedCategory, filterByCategory, fetchProducts } =
    useProducts();
  const { itemCount, total, isEmpty, addProduct } = useCart();
  const activeShift = useShiftStore((s) => s.activeShift);
  const refreshStatus = useShiftStore((s) => s.refreshStatus);
  const startShift = useShiftStore((s) => s.start);

  const [searchVisible, setSearchVisible] = useState(false);
  const [pickerProduct, setPickerProduct] = useState<Product | null>(null);
  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const [openingCash, setOpeningCash] = useState("");
  const [startingShift, setStartingShift] = useState(false);

  const displayName = user?.username ?? "Kasir";
  const outletLabel = selectedOutlet ? `${selectedOutlet.name} • ${selectedOutlet.code}` : "Outlet belum dipilih";

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
      // Wajib ada shift aktif sebelum mulai penjualan
      refreshStatus().then((shift) => {
        if (!shift) {
          setShiftModalVisible(true);
        }
      });
    }, [fetchProducts, refreshStatus]),
  );

  const handleStartShift = async () => {
    if (!selectedOutlet) {
      Alert.alert("Outlet belum dipilih", "Pilih outlet terlebih dahulu di menu Pengaturan.");
      return;
    }
    const cash = Number(openingCash || "0");
    if (!Number.isFinite(cash) || cash < 0) {
      Alert.alert("Kas awal tidak valid", "Masukkan nominal kas awal yang benar.");
      return;
    }
    try {
      setStartingShift(true);
      await startShift(selectedOutlet.id, cash);
      setShiftModalVisible(false);
      setOpeningCash("");
    } catch (err: any) {
      Alert.alert("Gagal memulai shift", err?.message ?? "Coba lagi nanti.");
    } finally {
      setStartingShift(false);
    }
  };

  /** Guard: hanya boleh transaksi jika shift aktif */
  const requireShift = () => {
    if (activeShift) return true;
    setShiftModalVisible(true);
    return false;
  };

  const handleAddProduct = (product: Product) => {
    if (!requireShift()) return;
    if ((product.productUnits?.length ?? 0) > 0) {
      // Produk multi-satuan → pilih satuan & qty dulu
      setPickerProduct(product);
      return;
    }
    addProduct(product);
  };

  const handleViewOrder = () => {
    if (!requireShift()) return;
    router.push("/kasir/order-review");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header: profil + tombol search + category pills (kasir.html) */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <ThemedText variant="base" weight="bold" color="primary">
                {displayName.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
            <View style={styles.profileInfo}>
              <ThemedText variant="sm" weight="bold" color="ink" numberOfLines={1}>
                {displayName}
              </ThemedText>
              <View style={styles.metaRow}>
                <View style={styles.statusDot} />
                <ThemedText variant="micro" color="textSecondary" numberOfLines={1}>
                  {outletLabel}
                </ThemedText>
              </View>
            </View>
          </View>
          <Pressable
            onPress={() => setSearchVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Cari produk"
            style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
          >
            <Search size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {searchVisible ? (
          <View style={styles.searchInputWrap}>
            <Search size={16} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari produk..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={searchProducts}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsContent}
        >
          <CategoryPill
            label="All"
            active={selectedCategory === null}
            onPress={() => filterByCategory(null)}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              label={category.name}
              active={selectedCategory === category.id}
              onPress={() => filterByCategory(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Grid produk */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <ProductCard product={item} onAdd={handleAddProduct} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState
              icon={PackageSearch}
              title={productsError ? "Gagal memuat produk" : "Produk tidak ditemukan"}
              subtitle={productsError ?? (productsLoading ? "Memuat..." : "Coba kata kunci lain atau ganti kategori")}
            />
          </View>
        }
      />

      {/* Sheet pilih satuan (produk multi-satuan) */}
      <UnitPickerSheet
        product={pickerProduct}
        visible={pickerProduct !== null}
        onClose={() => setPickerProduct(null)}
        onConfirm={(product, unit, quantity) => addProduct(product, unit, quantity)}
      />

      {/* Modal wajib mulai shift sebelum penjualan */}
      <Modal
        visible={shiftModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setShiftModalVisible(false)}
      >
        <View style={styles.shiftModalOverlay}>
          <View style={styles.shiftModalCard}>
            <ThemedText variant="lg" weight="bold" color="ink">
              Mulai Shift Kasir
            </ThemedText>
            <ThemedText variant="sm" color="textSecondary" style={styles.shiftModalHint}>
              Anda belum memiliki shift aktif. Mulai shift terlebih dahulu untuk melakukan penjualan.
            </ThemedText>
            <View style={styles.shiftInputWrap}>
              <Text style={styles.shiftInputPrefix}>Rp</Text>
              <TextInput
                style={styles.shiftInput}
                placeholder="Kas awal (mis. 500000)"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                value={openingCash}
                onChangeText={setOpeningCash}
              />
            </View>
            <Pressable
              onPress={handleStartShift}
              disabled={startingShift}
              style={({ pressed }) => [
                styles.shiftStartButton,
                (pressed || startingShift) && styles.pressed,
              ]}
            >
              <ThemedText variant="sm" weight="bold" color="onPrimary">
                {startingShift ? "Memulai..." : "Mulai Shift"}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Floating checkout bar (hanya saat cart tidak kosong) */}
      {!isEmpty ? (
        <View style={styles.checkoutBar} pointerEvents="box-none">
          <View style={styles.checkoutBarInner}>
            <View style={styles.checkoutLeft}>
              <View style={styles.itemCountBadge}>
                <ThemedText variant="xs" weight="bold" color="onPrimary">
                  {itemCount}
                </ThemedText>
              </View>
              <View>
                <ThemedText variant="micro" color="muted">
                  Items selected
                </ThemedText>
                <ThemedText variant="sm" weight="bold" color="white">
                  {formatRupiah(total)}
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={handleViewOrder}
              accessibilityRole="button"
              accessibilityLabel="Lihat pesanan"
              style={({ pressed }) => [styles.viewOrderButton, pressed && styles.pressed]}
            >
              <ThemedText variant="xs" weight="bold" color="onPrimary">
                View Order
              </ThemedText>
              <ArrowRight size={14} color={colors.onPrimary} strokeWidth={2.6} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Header
  header: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
    marginRight: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
  searchButton: {
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },

  // Search input
  searchInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: colors.ink,
  },

  // Category pills
  pillsContent: {
    gap: spacing.md,
  },
  pill: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  pillActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pillInactive: {
    backgroundColor: colors.card,
  },
  pillPressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },

  // Grid produk
  gridContent: {
    padding: spacing.screen,
    paddingBottom: 120,
    gap: spacing.lg,
  },
  gridRow: {
    gap: spacing.lg,
  },
  emptyWrap: {
    flex: 1,
    marginTop: spacing.xxxl,
  },

  // Floating checkout bar
  checkoutBar: {
    position: "absolute",
    left: spacing.screen,
    right: spacing.screen,
    bottom: spacing.md,
  },
  checkoutBarInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.card,
    ...shadows.overlay,
    shadowColor: colors.ink,
  },
  checkoutLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  itemCountBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  viewOrderButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },

  // Modal mulai shift
  shiftModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.screen,
  },
  shiftModalCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.card,
    gap: spacing.md,
  },
  shiftModalHint: {
    lineHeight: 18,
  },
  shiftInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  shiftInputPrefix: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  shiftInput: {
    flex: 1,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: colors.ink,
  },
  shiftStartButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    alignItems: "center",
    paddingVertical: spacing.md,
  },
});
