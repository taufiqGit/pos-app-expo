import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadows, spacing } from "@/theme";

const shifts = [
  {
    id: "SHIFT-1001",
    cashier: "Alya",
    openedAt: "08:00",
    closedAt: "12:30",
    totalSales: "Rp 2.450.000",
    status: "Closed",
  },
  {
    id: "SHIFT-1002",
    cashier: "Bima",
    openedAt: "12:30",
    closedAt: "17:00",
    totalSales: "Rp 3.120.000",
    status: "Closed",
  },
  {
    id: "SHIFT-1003",
    cashier: "Citra",
    openedAt: "17:00",
    closedAt: "-",
    totalSales: "Rp 1.080.000",
    status: "Active",
  },
];

export default function ShiftHistoryScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
            <Text style={styles.summaryValue}>1</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Hari Ini</Text>
            <Text style={styles.summaryValue}>3</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>28</Text>
          </View>
        </View>

        {/* Shift List */}
        <View style={styles.list}>
          {shifts.map((shift) => (
            <View key={shift.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.shiftId}>{shift.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    shift.status === "Active"
                      ? styles.statusActive
                      : styles.statusClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      shift.status === "Active"
                        ? styles.statusTextActive
                        : styles.statusTextClosed,
                    ]}
                  >
                    {shift.status}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.rowText}>Kasir: {shift.cashier}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text style={styles.rowText}>
                  {shift.openedAt} - {shift.closedAt}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Total Penjualan</Text>
                <Text style={styles.totalValue}>{shift.totalSales}</Text>
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
          ))}
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
