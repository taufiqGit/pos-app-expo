import { Tabs } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import { Clock3, History, LayoutGrid, Save, Settings2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, type ColorValue, View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors } from "@/theme";

const ICON_SIZE = 22;

interface TabIconProps {
  focused: boolean;
  color: ColorValue;
  size: number;
}

interface TabLabelProps {
  focused: boolean;
  color: ColorValue;
}

function renderTabIcon(Icon: LucideIcon) {
  return function TabIcon({ focused }: TabIconProps) {
    return (
      <Icon
        size={ICON_SIZE}
        color={focused ? colors.primary : colors.muted}
        strokeWidth={focused ? 2.4 : 2}
      />
    );
  };
}

function renderTabLabel(title: string) {
  return function TabLabel({ focused }: TabLabelProps) {
    return (
      <View style={styles.labelWrap}>
        <ThemedText
          variant="micro"
          weight={focused ? "bold" : "medium"}
          color={focused ? "primary" : "muted"}
        >
          {title}
        </ThemedText>
        {focused ? <View style={styles.dot} /> : null}
      </View>
    );
  };
}

const TABS: { name: string; title: string; Icon: LucideIcon }[] = [
  { name: "cashier", title: "Kasir", Icon: LayoutGrid },
  { name: "saved-orders", title: "Draft", Icon: Save },
  { name: "transaction-history", title: "Sales", Icon: History },
  { name: "shift-history", title: "Shift", Icon: Clock3 },
  { name: "settings", title: "Setting", Icon: Settings2 },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          height: 64,
        },
      }}
    >
      {TABS.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: renderTabIcon(Icon),
            tabBarLabel: renderTabLabel(title),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  labelWrap: {
    alignItems: "center",
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
    marginTop: 3,
  },
});
