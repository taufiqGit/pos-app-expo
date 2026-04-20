import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import {
  Home,
  ShoppingCart,
  Package,
  BarChart2,
  Settings,
} from "lucide-react-native";

type Tab = {
  label: string;
  icon: React.FC<{ size: number; color: string }>;
  route: string;
};

const TABS: Tab[] = [
  { label: "Home", icon: Home, route: "/(tabs)" },
  { label: "POS", icon: ShoppingCart, route: "/(tabs)/pos" },
  { label: "Products", icon: Package, route: "/(tabs)/products" },
  { label: "Reports", icon: BarChart2, route: "/(tabs)/reports" },
  { label: "Settings", icon: Settings, route: "/(tabs)/settings" },
];

const ACTIVE_COLOR = "#6C63FF";
const INACTIVE_COLOR = "#8E8E93";
const BG_COLOR = "#1C1C1E";

const BottomBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string): boolean => pathname.startsWith(route);

  return (
    <View style={styles.container}>
      {TABS.map(({ label, icon: Icon, route }) => {
        const active = isActive(route);
        return (
          <TouchableOpacity
            key={route}
            style={styles.tab}
            onPress={() => router.push(route as any)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: active }}
          >
            <Icon size={22} color={active ? ACTIVE_COLOR : INACTIVE_COLOR} />
            <Text style={[styles.label, active && styles.labelActive]}>
              {label}
            </Text>
            {active && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: BG_COLOR,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 8,
    paddingHorizontal: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    position: "relative",
    paddingVertical: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: INACTIVE_COLOR,
  },
  labelActive: {
    color: ACTIVE_COLOR,
    fontWeight: "700",
  },
  indicator: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: ACTIVE_COLOR,
  },
});

export default BottomBar;
