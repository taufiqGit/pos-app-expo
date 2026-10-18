import { Stack } from "expo-router";
import React from "react";

/** Stack untuk alur transaksi kasir — tanpa header, animasi slide native. */
export default function KasirStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="order-review" options={{ headerShown: false }} />
      <Stack.Screen name="payment" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
