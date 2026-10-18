import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ChevronLeft, Mail, ShieldCheck } from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, radius, shadows, spacing } from "@/theme";
import { useAuthStore } from "@/store/authStore";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  cashier: "Kasir",
  manager: "Manager",
};

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const initials = (user?.name ?? "POS")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <ChevronLeft size={20} color={colors.ink} />
        </Pressable>
        <ThemedText variant="lg" weight="bold" color="ink">
          Profile
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <ThemedText variant="xxl" weight="bold" color="primary">
              {initials}
            </ThemedText>
          </View>
          <ThemedText variant="lg" weight="bold" color="ink" style={styles.name}>
            {user?.name ?? "Pengguna POS"}
          </ThemedText>
          <View style={styles.roleBadge}>
            <ThemedText variant="micro" weight="bold" color="primary" uppercase>
              {user ? (ROLE_LABEL[user.role] ?? user.role) : "-"}
            </ThemedText>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Mail size={16} color={colors.textSecondary} />
              </View>
              <View style={styles.infoTexts}>
                <ThemedText variant="micro" color="muted">
                  Email
                </ThemedText>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  {user?.email ?? "-"}
                </ThemedText>
              </View>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <View style={styles.infoIcon}>
                <ShieldCheck size={16} color={colors.textSecondary} />
              </View>
              <View style={styles.infoTexts}>
                <ThemedText variant="micro" color="muted">
                  User ID
                </ThemedText>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  {user?.id ?? "-"}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    padding: spacing.xl,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.orangeBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  name: {
    marginBottom: spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.orangeBg,
    marginBottom: spacing.lg,
  },
  infoList: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: colors.lineStrong,
    borderStyle: "dashed",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTexts: {
    flex: 1,
    gap: 2,
  },
});
