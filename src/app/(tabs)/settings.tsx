import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CloudUpload,
  HelpCircle,
  Languages,
  Lock,
  LogOut,
  Moon,
  Printer,
  Store,
} from "lucide-react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, radius, shadows, spacing } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { useSettingsStore } from "@/store/settingsStore";
import { authService } from "../../services/authService";

/** Toggle pill gaya mockup (w-11 h-6, knob 16px). */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable
      style={[styles.toggle, value && styles.toggleOn]}
      onPress={() => onChange(!value)}
      hitSlop={8}
    >
      <View style={styles.toggleKnob} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const setDarkMode = useSettingsStore((state) => state.setDarkMode);
  const [notifications, setNotifications] = useState(true);

  const initials = (user?.name ?? "POS")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <ThemedText variant="xl" weight="bold" color="ink">
          Pengaturan
        </ThemedText>
        <ThemedText variant="micro" color="textSecondary" uppercase>
          Kasir ID: {user?.id ?? "-"} • V 1.0.0
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ThemedText variant="xs" weight="bold" color="muted" uppercase style={styles.sectionTitle}>
            Akun &amp; Profil
          </ThemedText>
          <View style={styles.card}>
            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={() => router.push("/settings/profile")}
            >
              <View style={styles.rowLeft}>
                <View style={styles.avatar}>
                  <ThemedText variant="sm" weight="bold" color="primary">
                    {initials}
                  </ThemedText>
                </View>
                <View>
                  <ThemedText variant="sm" weight="bold" color="ink">
                    {user?.name ?? "Pengguna POS"}
                  </ThemedText>
                  <ThemedText variant="micro" color="textSecondary">
                    {user?.email ?? "-"}
                  </ThemedText>
                </View>
              </View>
              <ChevronRight size={18} color={colors.muted} />
            </Pressable>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceMuted }]}>
                  <Lock size={16} color={colors.textSecondary} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Ganti Kata Sandi
                </ThemedText>
              </View>
              <ChevronRight size={18} color={colors.muted} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="xs" weight="bold" color="muted" uppercase style={styles.sectionTitle}>
            Aplikasi
          </ThemedText>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowDivider]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.infoBg }]}>
                  <Bell size={16} color={colors.info} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Notifikasi Transaksi
                </ThemedText>
              </View>
              <Toggle value={notifications} onChange={setNotifications} />
            </View>

            <View style={[styles.row, styles.rowDivider]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.purpleBg }]}>
                  <Moon size={16} color={colors.purple} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Mode Malam (Dark Mode)
                </ThemedText>
              </View>
              <Toggle value={darkMode} onChange={setDarkMode} />
            </View>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.successBg }]}>
                  <Languages size={16} color={colors.success} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Bahasa
                </ThemedText>
              </View>
              <View style={styles.rowTrailing}>
                <ThemedText variant="micro" weight="bold" color="primary">
                  BAHASA INDONESIA
                </ThemedText>
                <ChevronRight size={18} color={colors.muted} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText variant="xs" weight="bold" color="muted" uppercase style={styles.sectionTitle}>
            Toko &amp; Sistem
          </ThemedText>
          <View style={styles.card}>
            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={() => router.push("/select-outlet")}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceMuted }]}>
                  <Store size={16} color={colors.textSecondary} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Informasi Outlet
                </ThemedText>
              </View>
              <ChevronRight size={18} color={colors.muted} />
            </Pressable>

            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={() => router.push("/settings/printer-management")}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceMuted }]}>
                  <Printer size={16} color={colors.textSecondary} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Printer &amp; Bluetooth
                </ThemedText>
              </View>
              <View style={styles.connectedBadge}>
                <ThemedText variant="micro" weight="bold" color="success">
                  TERHUBUNG
                </ThemedText>
              </View>
            </Pressable>

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceMuted }]}>
                  <CloudUpload size={16} color={colors.textSecondary} />
                </View>
                <ThemedText variant="sm" weight="medium" color="inkSoft">
                  Backup Data Ke Cloud
                </ThemedText>
              </View>
              <ChevronRight size={18} color={colors.muted} />
            </View>
          </View>
        </View>

        <View style={styles.footerButtons}>
          <Pressable style={({ pressed }) => [styles.helpButton, pressed && styles.buttonPressed]}>
            <HelpCircle size={18} color={colors.textSecondary} />
            <ThemedText variant="sm" weight="bold" color="inkSoft">
              Pusat Bantuan
            </ThemedText>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.buttonPressed]} onPress={handleLogout}>
            <LogOut size={18} color={colors.danger} />
            <ThemedText variant="sm" weight="bold" color="dangerText">
              Keluar Dari Aplikasi
            </ThemedText>
          </Pressable>
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
  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    gap: 2,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl * 2,
    gap: spacing.xxl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.card,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  rowTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.orangeBg,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  connectedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.lineStrong,
    padding: 4,
    justifyContent: "center",
  },
  toggleOn: {
    backgroundColor: colors.primary,
    alignItems: "flex-end",
  },
  toggleKnob: {
    width: 16,
    height: 16,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  footerButtons: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.card,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadows.card,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.card,
    borderRadius: radius.xl,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    ...shadows.card,
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
