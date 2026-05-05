import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
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
        name="riwayat-transaksi"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pesanan-tersimpan"
        options={{
          title: "Tersimpan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="archive-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="kasir"
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
                style={[styles.kasirButtonContainer, props.style]}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.kasirButton,
                    isFocused && styles.kasirButtonActive,
                  ]}
                >
                  <Ionicons name="cart-outline" size={26} color="#FFFFFF" />
                </View>
                <Text
                  style={[
                    styles.kasirLabel,
                    isFocused && styles.kasirLabelActive,
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
        name="riwayat-shift"
        options={{
          title: "Shift",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
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
  kasirButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    top: -12,
  },
  kasirButton: {
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
  kasirButtonActive: {
    backgroundColor: "#6366f1",
  },
  kasirLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
  },
  kasirLabelActive: {
    color: "#c7d2fe",
  },
});
