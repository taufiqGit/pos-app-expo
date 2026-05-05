import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { authService } from "../../services/authService";

type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "printer-management",
    title: "Manajemen Printer",
    subtitle: "Atur printer dan auto print",
    icon: "print-outline",
    route: "/setting/printer-management",
  },
  {
    id: "profile",
    title: "Profile",
    subtitle: "Informasi akun dan preferensi",
    icon: "person-circle-outline",
    route: "/setting/profile",
  },
];

export default function SettingScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Setting</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => {
            const isLast = index === MENU_ITEMS.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, !isLast && styles.menuItemDivider]}
                activeOpacity={0.8}
                onPress={() => router.push(item.route)}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon} size={18} color="#4F46E5" />
                  </View>
                  <View>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  menuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  logoutSection: {
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});
