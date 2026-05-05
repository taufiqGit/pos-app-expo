import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { outletService, Outlet } from "../services/outletService";
import { useOutletStore } from "../store/outletStore";

export default function SelectOutletScreen() {
  const router = useRouter();
  const { selectedOutlet, setSelectedOutlet } = useOutletStore();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedOutlet?.id ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selected = useMemo(
    () => outlets.find((outlet) => outlet.id === selectedId) ?? null,
    [outlets, selectedId],
  );

  const loadOutlets = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await outletService.getOutlets();
      setOutlets(response?.data ?? []);
    } catch (error: any) {
      setErrorMessage(
        error?.message ?? "Gagal memuat outlet. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOutlets();
  }, []);

  const handleSelect = () => {
    if (!selected) {
      Alert.alert(
        "Outlet wajib dipilih",
        "Silakan pilih outlet terlebih dulu.",
      );
      return;
    }
    setSelectedOutlet(selected);
    router.replace("/(tabs)/kasir");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Pilih Outlet</Text>
        <Text style={styles.subtitle}>
          Anda wajib memilih outlet sebelum melanjutkan
        </Text>
      </View>

      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.loadingText}>Memuat daftar outlet.. oii.</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={loadOutlets}
              activeOpacity={0.85}
            >
              <Text style={styles.retryText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        ) : outlets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="storefront-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>Outlet belum tersedia</Text>
          </View>
        ) : (
          <FlatList
            data={outlets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <TouchableOpacity
                  style={[
                    styles.outletCard,
                    isSelected && styles.outletCardSelected,
                  ]}
                  onPress={() => setSelectedId(item.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.outletInfo}>
                    <Text style={styles.outletName}>{item.name}</Text>
                    <Text style={styles.outletMeta}>{item.code}</Text>
                    <Text style={styles.outletAddress} numberOfLines={2}>
                      {item.address}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#16A34A"
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, !selected && styles.primaryDisabled]}
          onPress={handleSelect}
          activeOpacity={0.85}
          disabled={!selected}
        >
          <Text style={styles.primaryText}>Pilih Outlet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  outletCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  outletCardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  outletInfo: {
    flex: 1,
    paddingRight: 12,
  },
  outletName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  outletMeta: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
  },
  outletAddress: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#FF6B35",
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  primaryButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
