import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type SavedOrder = {
  id: string;
  name: string;
  customer?: string;
  total: number;
  itemCount: number;
  updatedAt: string;
  status: "draft" | "hold";
};

const MOCK_ORDERS: SavedOrder[] = [
  {
    id: "SO-1023",
    name: "Pesanan Meja 3",
    customer: "Walk-in",
    total: 125000,
    itemCount: 4,
    updatedAt: "2 menit lalu",
    status: "hold",
  },
  {
    id: "SO-1022",
    name: "Pesanan Online",
    customer: "Budi",
    total: 86000,
    itemCount: 3,
    updatedAt: "10 menit lalu",
    status: "draft",
  },
  {
    id: "SO-1021",
    name: "Pesanan Takeaway",
    customer: "Sari",
    total: 52000,
    itemCount: 2,
    updatedAt: "25 menit lalu",
    status: "hold",
  },
];

const STATUS_LABEL: Record<SavedOrder["status"], string> = {
  draft: "Draft",
  hold: "Hold",
};

export default function PesananTersimpanScreen() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "draft" | "hold">(
    "all",
  );

  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const matchesSearch =
        order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        activeFilter === "all" || order.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pesanan Tersimpan</Text>
          <Text style={styles.subtitle}>
            Kelola pesanan yang belum diselesaikan
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Baru</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari pesanan..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {(["all", "draft", "hold"] as const).map((filter) => (
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
              {filter === "all" ? "Semua" : STATUS_LABEL[filter]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === "draft"
                      ? styles.statusDraft
                      : styles.statusHold,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {STATUS_LABEL[item.status]}
                  </Text>
                </View>
              </View>
              <Text style={styles.cardMeta}>
                {item.id} • {item.updatedAt}
              </Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardCustomer}>
                {item.customer ?? "Tanpa pelanggan"}
              </Text>
              <Text style={styles.cardItems}>{item.itemCount} item</Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.cardTotal}>
                Rp {item.total.toLocaleString("id-ID")}
              </Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionGhost}>
                  <Text style={styles.actionGhostText}>Hapus</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionPrimary}>
                  <Text style={styles.actionPrimaryText}>Lanjutkan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="archive-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Belum ada pesanan</Text>
            <Text style={styles.emptySubtitle}>
              Pesanan yang disimpan akan muncul di sini.
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
    backgroundColor: "#0F172A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  searchContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchInput: {
    flex: 1,
    height: 44,
    marginLeft: 8,
    color: "#E2E8F0",
    fontSize: 14,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterChipActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#CBD5F5",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  cardMeta: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardCustomer: {
    fontSize: 13,
    color: "#E2E8F0",
  },
  cardItems: {
    fontSize: 13,
    color: "#CBD5F5",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  cardTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionGhost: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  actionGhostText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#CBD5F5",
  },
  actionPrimary: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#4F46E5",
  },
  actionPrimaryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDraft: {
    backgroundColor: "#334155",
  },
  statusHold: {
    backgroundColor: "#1D4ED8",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E2E8F0",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
});
