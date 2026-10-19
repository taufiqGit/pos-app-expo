import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadows, spacing } from "@/theme";
import { formatRupiah } from "@/utils/format";
import {
  CashierShift,
  fetchCashierShifts,
  fetchCashierShiftStatus,
} from "@/services/cashierShiftService";

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "short",
  year: "numeric",
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

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return dateFormatter.format(d);
}

export default function ShiftHistoryScreen() {
  const [shifts, setShifts] = useState<CashierShift[]>([]);
  const [activeShift, setActiveShift] = useState<CashierShift | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [list, status] = await Promise.all([
        fetchCashierShifts(),
        fetchCashierShiftStatus(),
      ]);
      setShifts(list.shifts ?? []);
      setActiveShift(status && status.id ? status : null);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Gagal memuat riwayat shift");
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

  const todayKey = dayKeyFormatter.format(new Date());
  const todayCount = shifts.filter(
    (s) => s.created_at && dayKeyFormatter.format(new Date(s.created_at)) === todayKey,
  ).length;

  const isActive = (s: CashierShift) =>
    s.status === "active" || (!!activeShift && s.id === activeShift.id);

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={["top"]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Riwayat Shift</Text>
            <Text style={styles.subtitle}>
              Pantau shift kasir yang berjalan dan sudah selesai
            </Text>
          </View>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.85}>
            <Ionicons name="funnel-outline" size={18} color={colors.white} />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Shift Aktif</Text>
            <Text style={styles.summaryValue}>{activeShift ? 1 : 0}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Hari Ini</Text>
            <Text style={styles.summaryValue}>{todayCount}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{shifts.length}</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Shift List */}
        <View style={styles.list}>
          {shifts.length === 0 && !error && (
            <Text style={styles.emptyText}>Belum ada shift tercatat</Text>
          )}
          {shifts.map((shift) => {
            const active = isActive(shift);
            return (
              <View key={shift.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.shiftId}>{formatDate(shift.start_time)}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      active ? styles.statusActive : styles.statusClosed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        active ? styles.statusTextActive : styles.statusTextClosed,
                      ]}
                    >
                      {active ? "Active" : "Closed"}
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.rowText}>
                    {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.totalLabel}>Kas Awal</Text>
                  <Text style={styles.totalValue}>
                    {formatRupiah(shift.opening_cash ?? 0)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.detailButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.detailButtonText}>Lihat Detail</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
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
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.ink,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  filterText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    marginBottom: spacing.lg,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.ink,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.line,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.dangerText,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
    paddingVertical: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shiftId: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.ink,
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusActive: {
    backgroundColor: colors.successBg,
  },
  statusClosed: {
    backgroundColor: colors.surfaceMuted,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextClosed: {
    color: colors.textSecondary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  rowText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
  },
  cardFooter: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.primary,
  },
  detailButton: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailButtonText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: colors.primary,
  },
});
