import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Transaction = {
  id: string;
  customer: string;
  total: string;
  method: string;
  status: "Paid" | "Refunded";
  time: string;
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "#1042",
    customer: "Walk-in",
    total: "Rp 152.000",
    method: "Tunai",
    status: "Paid",
    time: "2 menit lalu",
  },
  {
    id: "#1041",
    customer: "Dian S.",
    total: "Rp 48.500",
    method: "QRIS",
    status: "Paid",
    time: "15 menit lalu",
  },
  {
    id: "#1040",
    customer: "Walk-in",
    total: "Rp 73.000",
    method: "Kartu",
    status: "Refunded",
    time: "42 menit lalu",
  },
  {
    id: "#1039",
    customer: "Andi P.",
    total: "Rp 29.900",
    method: "Tunai",
    status: "Paid",
    time: "1 jam lalu",
  },
];

const FILTERS = ["Semua", "Paid", "Refunded"] as const;
type FilterType = (typeof FILTERS)[number];

export default function RiwayatTransaksiScreen() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("Semua");

  const filtered = MOCK_TRANSACTIONS.filter((trx) => {
    const matchSearch =
      trx.id.toLowerCase().includes(search.toLowerCase()) ||
      trx.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === "Semua" || trx.status === activeFilter;
    return matchSearch && matchFilter;
  });

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.trxId}>{item.id}</Text>
          <Text style={styles.customer}>{item.customer}</Text>
        </View>
        <View style={styles.amountWrap}>
          <Text style={styles.amount}>{item.total}</Text>
          <View
            style={[
              styles.statusBadge,
              item.status === "Refunded"
                ? styles.statusRefunded
                : styles.statusPaid,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === "Refunded"
                  ? styles.statusTextRefunded
                  : styles.statusTextPaid,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.meta}>{item.method}</Text>
        <Text style={styles.meta}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Transaksi</Text>
        <Text style={styles.subtitle}>Daftar transaksi terbaru dari kasir</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari ID / nama pelanggan"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Tidak ada transaksi</Text>
            <Text style={styles.emptySubtitle}>
              Coba ubah filter atau kata kunci pencarian.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#0F172A",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#4F46E5",
  },
  filterChipText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  trxId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  customer: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  amountWrap: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  statusBadge: {
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusPaid: {
    backgroundColor: "#D1FAE5",
  },
  statusRefunded: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextPaid: {
    color: "#065F46",
  },
  statusTextRefunded: {
    color: "#991B1B",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    fontSize: 12,
    color: "#94A3B8",
  },
  emptyState: {
    paddingTop: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
