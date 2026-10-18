import React, { useMemo, useState } from "react";
import { Image } from "expo-image";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Archive,
  ArrowRight,
  Filter,
  Search,
  ShoppingBag,
  Trash2,
} from "lucide-react-native";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, radius, shadows, spacing } from "@/theme";
import { formatRupiah } from "@/utils/format";

type OrderType = "dine-in" | "take-away";

type SavedOrder = {
  id: string;
  customer: string;
  time: string;
  type: OrderType;
  items: string[]; // url gambar item (avatar stack)
  itemCount: number;
  total: number;
};

const MOCK_ORDERS: SavedOrder[] = [
  {
    id: "DF-2024",
    customer: "Meja 08",
    time: "14:20 WIB",
    type: "dine-in",
    items: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&fit=crop",
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&fit=crop",
    ],
    itemCount: 3,
    total: 295000,
  },
  {
    id: "DF-2023",
    customer: "Walk-in Customer",
    time: "13:45 WIB",
    type: "take-away",
    items: [
      "https://images.unsplash.com/photo-1544145945-f904253d0c7e?w=100&fit=crop",
    ],
    itemCount: 1,
    total: 28000,
  },
  {
    id: "DF-2022",
    customer: "Meja 12",
    time: "12:10 WIB",
    type: "dine-in",
    items: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&fit=crop",
      "https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=100&fit=crop",
    ],
    itemCount: 4,
    total: 512000,
  },
  {
    id: "DF-2021",
    customer: "Meja 05",
    time: "11:32 WIB",
    type: "dine-in",
    items: [
      "https://images.unsplash.com/photo-1559703248-dcaaec9fab78?w=100&fit=crop",
    ],
    itemCount: 2,
    total: 118000,
  },
];

const TYPE_META: Record<OrderType, { label: string; bg: string; fg: string }> = {
  "dine-in": { label: "DINE-IN", bg: colors.infoBg, fg: colors.info },
  "take-away": { label: "TAKE-AWAY", bg: colors.orangeBg, fg: colors.primary },
};

export default function SavedOrdersScreen() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return MOCK_ORDERS;
    const q = search.toLowerCase();
    return MOCK_ORDERS.filter(
      (order) =>
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q),
    );
  }, [search]);

  const activeCount = MOCK_ORDERS.length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText variant="xl" weight="bold" color="ink">
            Pesanan Tersimpan
          </ThemedText>
          <ThemedText variant="micro" color="muted" uppercase>
            {activeCount} Draf Aktif
          </ThemedText>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton}>
            <Filter size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={[styles.iconButton, showSearch && styles.iconButtonActive]}
            onPress={() => {
              setShowSearch((v) => !v);
              if (showSearch) setSearch("");
            }}
          >
            <Search
              size={18}
              color={showSearch ? colors.ink : colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <Search size={16} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pesanan..."
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map((order) => {
          const type = TYPE_META[order.type];
          const extra = order.itemCount - order.items.length;
          return (
            <View key={order.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconSquare}>
                    <ShoppingBag size={24} color={colors.primary} />
                  </View>
                  <View>
                    <ThemedText variant="sm" weight="bold" color="ink">
                      Order #{order.id}
                    </ThemedText>
                    <ThemedText variant="micro" color="muted">
                      {order.customer} • {order.time}
                    </ThemedText>
                  </View>
                </View>
                <View style={[styles.typeBadge, { backgroundColor: type.bg }]}>
                  <ThemedText
                    variant="micro"
                    weight="bold"
                    uppercase
                    style={{ color: type.fg }}
                  >
                    {type.label}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardMiddle}>
                <View style={styles.avatarStack}>
                  {order.items.map((uri) => (
                    <Image key={uri} source={{ uri }} style={styles.avatar} />
                  ))}
                  {extra > 0 && (
                    <View style={styles.avatarMore}>
                      <ThemedText variant="micro" weight="bold" color="muted">
                        +{extra}
                      </ThemedText>
                    </View>
                  )}
                </View>
                <View style={styles.priceBlock}>
                  <ThemedText variant="micro" color="muted">
                    {order.itemCount} Items
                  </ThemedText>
                  <ThemedText variant="sm" weight="bold" color="primary">
                    {formatRupiah(order.total)}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.cardActions}>
                <Pressable style={styles.deleteButton}>
                  <Trash2 size={14} color={colors.dangerText} />
                  <ThemedText variant="xs" weight="bold" color="dangerText">
                    Hapus
                  </ThemedText>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.resumeButton,
                    pressed && styles.resumeButtonPressed,
                  ]}
                >
                  <ThemedText variant="xs" weight="bold" color="white">
                    Lanjutkan Pesanan
                  </ThemedText>
                  <ArrowRight size={14} color={colors.white} />
                </Pressable>
              </View>
            </View>
          );
        })}
        {filteredOrders.length === 0 && (
          <EmptyState
            icon={Archive}
            title="Belum ada pesanan"
            subtitle="Pesanan yang disimpan akan muncul di sini."
          />
        )}
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
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonActive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  searchContainer: {
    marginHorizontal: spacing.screen,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
    color: colors.ink,
  },
  scrollView: {
    flex: 1,
  },
  list: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    gap: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  iconSquare: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.orangeBg,
    alignItems: "center",
    justifyContent: "center",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  cardMiddle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.lineStrong,
    borderStyle: "dashed",
    borderBottomWidth: 1,
    borderBottomColor: colors.lineStrong,
    paddingVertical: spacing.md,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.surfaceMuted,
    marginLeft: -8,
  },
  avatarMore: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -8,
  },
  priceBlock: {
    alignItems: "flex-end",
    gap: 2,
  },
  cardActions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  resumeButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
  },
  resumeButtonPressed: {
    opacity: 0.85,
  },
});
