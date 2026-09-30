import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: {
          backgroundColor: "#0F172A",
          borderTopColor: "#1F2937",
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="transaction-history"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved-orders"
        options={{
          title: "Tersimpan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="archive-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cashier"
        options={{
          title: "Kasir",
          tabBarButton: (props) => {
            const isFocused = props.accessibilityState?.selected;
            const onPress = props.onPress as
              | ((e: GestureResponderEvent) => void)
              | undefined;
            const onLongPress = props.onLongPress as
              | ((e: GestureResponderEvent) => void)
              | undefined;
            return (
              <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole={props.accessibilityRole}
                accessibilityState={props.accessibilityState}
                accessibilityLabel={props.accessibilityLabel}
                testID={props.testID}
                style={[styles.cashierButtonContainer, props.style]}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.cashierButton,
                    isFocused && styles.cashierButtonActive,
                  ]}
                >
                  <Ionicons name="cart-outline" size={26} color="#FFFFFF" />
                </View>
                <Text
                  style={[
                    styles.cashierLabel,
                    isFocused && styles.cashierLabelActive,
                  ]}
                >
                  Kasir
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <Tabs.Screen
        name="shift-history"
        options={{
          title: "Shift",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Setting",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cashierButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: -12,
  },
  cashierButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  cashierButtonActive: {
    backgroundColor: "#6366f1",
  },
  cashierLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
  },
  cashierLabelActive: {
    color: "#c7d2fe",
  },
});
