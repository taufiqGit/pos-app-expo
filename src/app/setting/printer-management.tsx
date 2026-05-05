import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Printer = {
  id: string;
  name: string;
  model: string;
  status: "connected" | "disconnected";
  location: string;
};

const PRINTERS: Printer[] = [
  {
    id: "printer-1",
    name: "Printer Kasir Utama",
    model: "Thermal X200",
    status: "connected",
    location: "Kasir",
  },
  {
    id: "printer-2",
    name: "Printer Dapur",
    model: "Kitchen Pro",
    status: "disconnected",
    location: "Dapur",
  },
];

export default function PrinterManagementScreen() {
  const [autoPrint, setAutoPrint] = useState(true);
  const router = useRouter();

  const renderPrinter = ({ item }: { item: Printer }) => {
    const isConnected = item.status === "connected";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.printerName}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              isConnected ? styles.statusConnected : styles.statusDisconnected,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isConnected
                  ? styles.statusTextConnected
                  : styles.statusTextDisconnected,
              ]}
            >
              {isConnected ? "Terhubung" : "Terputus"}
            </Text>
          </View>
        </View>

        <Text style={styles.printerMeta}>{item.model}</Text>
        <Text style={styles.printerMeta}>Lokasi: {item.location}</Text>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Tes Cetak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Atur</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.title}>Manajemen Printer</Text>
        </View>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingCard}>
        <View>
          <Text style={styles.settingTitle}>Auto Print</Text>
          <Text style={styles.settingSubtitle}>
            Cetak otomatis setelah transaksi berhasil
          </Text>
        </View>
        <Switch
          value={autoPrint}
          onValueChange={setAutoPrint}
          trackColor={{ false: "#E2E8F0", true: "#C7D2FE" }}
          thumbColor={autoPrint ? "#4F46E5" : "#94A3B8"}
        />
      </View>

      <FlatList
        data={PRINTERS}
        keyExtractor={(item) => item.id}
        renderItem={renderPrinter}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
  settingCard: {
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  printerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  printerMeta: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusConnected: {
    backgroundColor: "#DCFCE7",
  },
  statusDisconnected: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextConnected: {
    color: "#166534",
  },
  statusTextDisconnected: {
    color: "#991B1B",
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 12,
  },
});
