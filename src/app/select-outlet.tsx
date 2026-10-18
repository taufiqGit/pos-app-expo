import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { CheckCircle2, Store } from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, radius, shadows, spacing } from "@/theme";
import { outletService, Outlet } from "../services/outletService";
import { useOutletStore } from "../store/outletStore";

export default function SelectOutletScreen() {
  const router = useRouter();
  const { selectedOutlet, setSelectedOutlet } = useOutletStore();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedOutlet?.id ?? null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selected = useMemo(
    () => outlets.find((outlet) => outlet.id === selectedId) ?? null,
    [outlets, selectedId],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await outletService.getOutlets();
        if (!cancelled) setOutlets(response?.data ?? []);
      } catch (error: any) {
        if (!cancelled) {
          setErrorMessage(
            error?.message ?? "Gagal memuat outlet. Silakan coba lagi.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = async () => {
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

  const handleSelect = () => {
    if (!selected) {
      Alert.alert(
        "Outlet wajib dipilih",
        "Silakan pilih outlet terlebih dulu.",
      );
      return;
    }
    setSelectedOutlet(selected);
    router.replace("/(tabs)/cashier");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText variant="xl" weight="bold" color="ink">
          Pilih Outlet
        </ThemedText>
        <ThemedText variant="xs" color="textSecondary">
          Anda wajib memilih outlet sebelum melanjutkan
        </ThemedText>
      </View>

      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <ThemedText variant="sm" color="textSecondary">
              Memuat daftar outlet...
            </ThemedText>
          </View>
        ) : errorMessage ? (
          <View style={styles.stateContainer}>
            <ThemedText variant="sm" color="dangerText" style={styles.errorText}>
              {errorMessage}
            </ThemedText>
            <Pressable style={styles.retryButton} onPress={handleRetry}>
              <ThemedText variant="sm" weight="bold" color="white">
                Coba Lagi
              </ThemedText>
            </Pressable>
          </View>
        ) : outlets.length === 0 ? (
          <View style={styles.stateContainer}>
            <View style={styles.emptyIcon}>
              <Store size={32} color={colors.muted} />
            </View>
            <ThemedText variant="sm" color="muted">
              Outlet belum tersedia
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={outlets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedId;
              return (
                <Pressable
                  style={[
                    styles.outletCard,
                    isSelected && styles.outletCardSelected,
                  ]}
                  onPress={() => setSelectedId(item.id)}
                >
                  <View style={styles.outletInfo}>
                    <ThemedText variant="sm" weight="bold" color="ink">
                      {item.name}
                    </ThemedText>
                    <ThemedText variant="micro" weight="medium" color="textSecondary">
                      {item.code}
                    </ThemedText>
                    <ThemedText variant="micro" color="muted" numberOfLines={2}>
                      {item.address}
                    </ThemedText>
                  </View>
                  {isSelected && (
                    <CheckCircle2 size={24} color={colors.success} />
                  )}
                </Pressable>
              );
            }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            !selected && styles.primaryDisabled,
            pressed && selected && styles.primaryPressed,
          ]}
          onPress={handleSelect}
          disabled={!selected}
        >
          <ThemedText variant="sm" weight="bold" color="white">
            Pilih Outlet
          </ThemedText>
        </Pressable>
      </View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  outletCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  outletCardSelected: {
    borderColor: colors.success,
    backgroundColor: colors.successBg,
  },
  outletInfo: {
    flex: 1,
    paddingRight: spacing.md,
    gap: 2,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
  },
  footer: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.md,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  primaryButton: {
    backgroundColor: colors.ink,
    borderRadius: radius.md,
    paddingVertical: spacing.card,
    alignItems: "center",
  },
  primaryDisabled: {
    opacity: 0.5,
  },
  primaryPressed: {
    opacity: 0.85,
  },
});
