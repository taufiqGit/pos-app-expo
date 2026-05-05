import React, { useEffect, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { authStorage } from "../services/authStorage";
import { apiEvents } from "../services/apiEvents";
import { useOutletStore } from "../store/outletStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const { selectedOutlet, hasHydrated } = useOutletStore();

  const checkAuth = async () => {
    const token = await authStorage.getAccessToken();
    return Boolean(token);
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = apiEvents.on("unauthorized", async () => {
      await authStorage.clearTokens();
      router.replace("/(auth)/login");
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!isReady || !hasHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inSelectOutlet = segments[0] === "select-outlet";

    (async () => {
      const latestAuth = await checkAuth();

      if (!latestAuth) {
        if (!inAuthGroup) {
          router.replace("/(auth)/login");
        }
        return;
      }

      if (!selectedOutlet) {
        if (!inSelectOutlet) {
          router.replace("/select-outlet");
        }
        return;
      }

      if (inAuthGroup || inSelectOutlet) {
        router.replace("/(tabs)/kasir");
      }
    })();
  }, [isReady, hasHydrated, segments, router, selectedOutlet]);

  if (!isReady || !hasHydrated) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
});
