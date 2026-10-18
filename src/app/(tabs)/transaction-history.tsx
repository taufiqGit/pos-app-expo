import React, { useMemo, useState } from "react";
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
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, motion, radius, shadows, spacing } from "@/theme";
import { formatRupiah } from "@/utils/format";

type TransactionStatus = "success" | "refunded";
type PaymentKind = "cash" | "cashless" | "ewallet";

interface MockTransaction {
  id: string;
  time: string;
  menuCount: number;
  total: number;
  status: TransactionStatus;
  kind: PaymentKind;
  day: "today" | "yesterday";
}

const MOCK_TRANSACTIONS: MockTransaction[] = [
  { id: "TRX-8829", time: "09:41", menuCount: 3, total: 18500, status: "success", kind: "cashless", day: "today" },
  { id: "TRX-8828", time: "08:20", menuCount: 1, total: 5350, status: "success", kind: "cash", day: "today" },
  { id: "TRX-8815", time: "19:15", menuCount: 5, total: 42100, status: "refunded", kind: "ewallet", day: "yesterday" },
  { id: "TRX-8810", time: "13:02", menuCount: 2, total: 67000, status: "success", kind: "cash", day: "yesterday" },
];

const PAYMENT_META: Record<PaymentKind, { label: string; Icon: LucideIcon }> = {
  cash: { label: "Tunai", Icon: Banknote },
  cashless: { label: "Cashless Credit", Icon: CreditCard },
  ewallet: { label: "OVO / QRIS", Icon: Wallet },
};

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
  const [searchVisible, setSearchVisible] = useState(false);
  const [search, setSearch] = useState("");

  const todayTotal = useMemo(
    () => MOCK_TRANSACTIONS.filter((t) => t.day === "today").reduce((sum, t) => sum + t.total, 0),
    [],
  );

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return MOCK_TRANSACTIONS.filter((t) => t.id.toLowerCase().includes(lower));
  }, [search]);

  const todayTransactions = filtered.filter((t) => t.day === "today");
  const yesterdayTransactions = filtered.filter((t) => t.day === "yesterday");

  const renderTransaction = (item: MockTransaction) => {
    const { label: methodLabel, Icon: MethodIcon } = PAYMENT_META[item.kind];
    const isSuccess = item.status === "success";
    return (
      <Pressable
        key={item.id}
        // TODO: detail transaksi (route /transaction/[id]) menyusul bersama API
        accessibilityRole="button"
        accessibilityLabel={`Order ${item.id}, ${formatRupiah(item.total)}`}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIdentity}>
            <View style={styles.receiptIcon}>
              <ReceiptText size={20} color={colors.white} />
            </View>
            <View>
              <ThemedText variant="sm" weight="bold" color="ink">
                Order #{item.id}
              </ThemedText>
              <ThemedText variant="micro" color="muted">
                {item.time} • {item.menuCount} Menu
              </ThemedText>
            </View>
          </View>
          <View style={styles.cardAmount}>
            <ThemedText variant="sm" weight="bold" color="primary">
              {formatRupiah(item.total)}
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
                {isSuccess ? "Success" : "Refunded"}
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
            label="Cashless"
            dotColor={colors.success}
            textColor={colors.success}
            bgColor={colors.successBg}
          />
          <StatPill
            label="Tunai"
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
        ListHeaderComponent={
          todayTransactions.length > 0 ? (
            <ThemedText variant="micro" weight="bold" color="muted" uppercase style={styles.sectionLabel}>
              Hari ini
            </ThemedText>
          ) : null
        }
        renderItem={({ item }) => {
          const isYesterday = item.day === "yesterday";
          return (
            <View>
              {isYesterday ? (
                <ThemedText variant="micro" weight="bold" color="muted" uppercase style={styles.sectionLabel}>
                  Kemarin
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
              title="Tidak ada riwayat"
              subtitle="Coba ubah filter atau kata kunci pencarian Anda"
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
