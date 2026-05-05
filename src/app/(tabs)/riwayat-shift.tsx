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

export default function RiwayatShiftScreen() {
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
            <Ionicons name="funnel-outline" size={18} color="#FFFFFF" />
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
                <Ionicons name="person-outline" size={16} color="#64748B" />
                <Text style={styles.rowText}>Kasir: {shift.cashier}</Text>
              </View>

              <View style={styles.row}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
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
                <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
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
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    marginTop: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E2E8F0",
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    color: "#0F172A",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusActive: {
    backgroundColor: "#DCFCE7",
  },
  statusClosed: {
    backgroundColor: "#E2E8F0",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextActive: {
    color: "#166534",
  },
  statusTextClosed: {
    color: "#334155",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  rowText: {
    fontSize: 12,
    color: "#475569",
  },
  cardFooter: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  detailButton: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4F46E5",
  },
});
