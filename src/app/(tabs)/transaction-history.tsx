import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Banknote,
  Calendar,
  ChevronRight,
  CreditCard,
  ReceiptText,
  Search,
  SearchX,
  Wallet,
  type LucideIcon,
} from "lucide-react-native";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemedText } from "@/components/ui/ThemedText";
import { fetchSales, type Sale } from "@/services/salesService";
import { colors, motion, radius, shadows, spacing } from "@/theme";
import { formatRupiah } from "@/utils/format";

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Jakarta",
});

function formatTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return timeFormatter.format(d);
}

function dayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return dayKeyFormatter.format(d);
}

/** Nomor order pendek dari UUID: 8 karakter pertama */
function shortOrderNo(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

type PaymentKind = "cash" | "cashless" | "ewallet";

const PAYMENT_META: Record<PaymentKind, { label: string; Icon: LucideIcon }> = {
  cash: { label: "Tunai", Icon: Banknote },
  cashless: { label: "Cashless Credit", Icon: CreditCard },
  ewallet: { label: "OVO / QRIS", Icon: Wallet },
};

/** Mapping payment_method backend → kategori UI */
function paymentKind(method: string): PaymentKind {
  switch (method) {
    case "cash":
      return "cash";
    case "debit_card":
    case "credit_card":
      return "cashless";
    case "qris":
    case "transfer":
      return "ewallet";
    default:
      return "cash";
  }
}

/** Label status transaksi backend → UI */
function statusLabel(status: string): { label: string; isSuccess: boolean } {
  switch (status) {
    case "completed":
      return { label: "Success", isSuccess: true };
    case "refunded":
      return { label: "Refunded", isSuccess: false };
    default:
      return { label: status.charAt(0).toUpperCase() + status.slice(1), isSuccess: false };
  }
}

interface StatPillProps {
  label: string;
  dotColor: string;
  textColor: string;
  bgColor: string;
}

function StatPill({ label, dotColor, textColor, bgColor }: StatPillProps) {
  return (
    <View style={[styles.statPill, { backgroundColor: bgColor }]}>
      <View style={[styles.statDot, { backgroundColor: dotColor }]} />
      <ThemedText variant="micro" weight="bold" style={{ color: textColor }}>
        {label}
      </ThemedText>
    </View>
  );
}

export default function TransactionHistoryScreen() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const list = await fetchSales(1, 50);
      setSales(list);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat riwayat penjualan");
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const todayKey = dayKey(new Date().toISOString());

  const todayTotal = useMemo(
    () =>
      sales
        .filter((s) => dayKey(s.created_at) === todayKey)
        .reduce((sum, s) => sum + (s.grand_total ?? 0), 0),
    [sales, todayKey],
  );

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    if (!lower) return sales;
    return sales.filter(
      (s) =>
        s.id.toLowerCase().includes(lower) ||
        shortOrderNo(s.id).toLowerCase().includes(lower) ||
        (s.outlet_name ?? "").toLowerCase().includes(lower) ||
        (s.user_name ?? "").toLowerCase().includes(lower),
    );
  }, [sales, search]);

  const todayTransactions = filtered.filter((s) => dayKey(s.created_at) === todayKey);
  const yesterdayTransactions = filtered.filter((s) => dayKey(s.created_at) !== todayKey);

  const cashCount = sales.filter((s) => paymentKind(s.payment_method) === "cash").length;
  const cashlessCount = sales.filter((s) => paymentKind(s.payment_method) !== "cash").length;

  const renderTransaction = (item: Sale) => {
    const kind = paymentKind(item.payment_method);
    const { label: methodLabel, Icon: MethodIcon } = PAYMENT_META[kind];
    const { label: statusText, isSuccess } = statusLabel(item.status);
    return (
      <Pressable
        key={item.id}
        // TODO: detail transaksi (route /transaction/[id]) menyusul bersama API
        accessibilityRole="button"
        accessibilityLabel={`Order ${shortOrderNo(item.id)}, ${formatRupiah(item.grand_total)}`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIdentity}>
            <View style={styles.receiptIcon}>
              <ReceiptText size={20} color={colors.white} />
            </View>
            <View>
              <ThemedText variant="sm" weight="bold" color="ink">
                Order #{shortOrderNo(item.id)}
              </ThemedText>
              <ThemedText variant="micro" color="muted">
                {formatTime(item.created_at)} • {item.user_name ?? "-"}
              </ThemedText>
            </View>
          </View>
          <View style={styles.cardAmount}>
            <ThemedText variant="sm" weight="bold" color="primary">
              {formatRupiah(item.grand_total)}
            </ThemedText>
            <View
              style={[
                styles.statusBadge,
                isSuccess ? styles.statusSuccess : styles.statusRefunded,
              ]}
            >
              <ThemedText
                variant="micro"
                weight="bold"
                color={isSuccess ? "success" : "danger"}
              >
                {statusText}
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.methodRow}>
            <MethodIcon size={14} color={colors.muted} />
            <ThemedText variant="xs" color="textSecondary">
              {methodLabel}
            </ThemedText>
          </View>
          <ChevronRight size={18} color={colors.faint} />
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header — history-sales.html */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="xl" weight="bold" color="ink">
              Riwayat Penjualan
            </ThemedText>
            <ThemedText variant="micro" color="textSecondary" uppercase>
              Total hari ini: {formatRupiah(todayTotal)}
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              // TODO: filter rentang tanggal menyusul
              accessibilityRole="button"
              accessibilityLabel="Filter tanggal"
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <Calendar size={20} color={colors.textSecondary} />
            </Pressable>
            <Pressable
              onPress={() => setSearchVisible((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Cari transaksi"
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <Search size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {searchVisible ? (
          <View style={styles.searchInputWrap}>
            <Search size={16} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nomor order..."
              placeholderTextColor={colors.muted}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ) : null}

        {/* Quick summary stats */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          <StatPill
            label={`${todayTransactions.length} Transaksi`}
            dotColor={colors.primary}
            textColor={colors.primary}
            bgColor={colors.orangeBg}
          />
          <StatPill
            label={`${cashlessCount} Cashless`}
            dotColor={colors.success}
            textColor={colors.success}
            bgColor={colors.successBg}
          />
          <StatPill
            label={`${cashCount} Tunai`}
            dotColor={colors.info}
            textColor={colors.info}
            bgColor={colors.infoBg}
          />
        </ScrollView>
      </View>

      {/* List transaksi */}
      <FlatList
        data={[...todayTransactions, ...yesterdayTransactions]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          error ? (
            <ThemedText variant="xs" color="danger" style={styles.errorText}>
              {error}
            </ThemedText>
          ) : todayTransactions.length > 0 ? (
            <ThemedText variant="micro" weight="bold" color="muted" uppercase style={styles.sectionLabel}>
              Hari ini
            </ThemedText>
          ) : null
        }
        renderItem={({ item }) => {
          const isNotToday = dayKey(item.created_at) !== todayKey;
          return (
            <View>
              {isNotToday ? (
                <ThemedText variant="micro" weight="bold" color="muted" uppercase style={styles.sectionLabel}>
                  Sebelumnya
                </ThemedText>
              ) : null}
              {renderTransaction(item)}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState
              icon={SearchX}
              title={error ? "Gagal memuat transaksi" : "Tidak ada riwayat"}
              subtitle={error ?? "Coba kata kunci lain atau tarik ke bawah untuk memuat ulang"}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
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

  // Stats
  statsRow: {
    gap: spacing.md,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },

  // List
  listContent: {
    padding: spacing.screen,
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  emptyWrap: {
    marginTop: spacing.xxxl,
  },
  errorText: {
    textAlign: "center",
  },

  // Card transaksi
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.card,
    gap: spacing.lg,
    ...shadows.card,
  },
  cardPressed: {
    transform: [{ scale: motion.pressScale }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardIdentity: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  receiptIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  cardAmount: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
  statusSuccess: {
    backgroundColor: colors.successBg,
  },
  statusRefunded: {
    backgroundColor: colors.dangerBg,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderStyle: "dashed",
    paddingTop: spacing.md,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },
});
