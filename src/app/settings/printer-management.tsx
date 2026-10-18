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
import { useRouter } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";
import { colors, radius, shadows, spacing } from "@/theme";

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
              {isConnected ? "TERHUBUNG" : "TERPUTUS"}
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
            <ChevronLeft size={20} color={colors.ink} />
          </TouchableOpacity>
          <Text style={styles.title}>Manajemen Printer</Text>
        </View>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
          <Plus size={16} color={colors.white} />
          <Text style={styles.addButtonText}>Tambah</Text>
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
          trackColor={{ false: colors.lineStrong, true: colors.primary }}
          thumbColor={colors.white}
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
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.ink,
  },
  addButton: {
    backgroundColor: colors.ink,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.md,
  },
  addButtonText: {
    color: colors.white,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontWeight: "600",
    fontSize: 13,
  },
  settingCard: {
    marginHorizontal: spacing.screen,
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.ink,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
  },
  list: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  printerName: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    color: colors.ink,
  },
  printerMeta: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusConnected: {
    backgroundColor: colors.successBg,
  },
  statusDisconnected: {
    backgroundColor: colors.dangerBg,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  statusTextConnected: {
    color: colors.success,
  },
  statusTextDisconnected: {
    color: colors.dangerText,
  },
  cardActions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.white,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontWeight: "600",
    fontSize: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.inkSoft,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontWeight: "600",
    fontSize: 12,
  },
});
