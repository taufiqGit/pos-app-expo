import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { apiEvents } from "../services/apiEvents";
import { refreshTokens } from "../services/api";
import { authStorage } from "../services/authStorage";
import { useOutletStore } from "../store/outletStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [hydrationTimedOut, setHydrationTimedOut] = useState(false);
  const { selectedOutlet, hasHydrated } = useOutletStore();

  const checkAuth = async (): Promise<boolean> => {
    const accessToken = await authStorage.getAccessToken();
    if (accessToken) return true;

    // Access token hilang/kadaluarsa — coba perpanjang sesi via refresh token
    const refreshToken = await authStorage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      await refreshTokens();
      console.log("refreshTokens success");
      return Boolean(await authStorage.getAccessToken());
    } catch {
      console.log("refreshTokens failed");
      return false;
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      await checkAuth();
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    // Prevent infinite loader if persisted store hydration does not finish.
    const timeout = setTimeout(() => {
      setHydrationTimedOut(true);
    }, 2000);

    if (hasHydrated) {
      clearTimeout(timeout);
      setHydrationTimedOut(false);
    }

    return () => clearTimeout(timeout);
  }, [hasHydrated]);

  useEffect(() => {
    const unsubscribe = apiEvents.on("unauthorized", async () => {
      await authStorage.clearTokens();
      router.replace("/(auth)/login");
    });

    return unsubscribe;
  }, [router]);

  useEffect(() => {
    if (!isReady || (!hasHydrated && !hydrationTimedOut)) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inSelectOutlet = segments[0] === "select-outlet";
    // Route "/" (index) hanya layar sementara — wajib di-redirect ke tujuan akhir
    const isIndexRoute = pathname === "/";

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

      if (inAuthGroup || inSelectOutlet || isIndexRoute) {
        router.replace("/(tabs)/cashier");
      }
    })();
  }, [isReady, hasHydrated, hydrationTimedOut, segments, pathname, router, selectedOutlet]);

  if (!isReady || (!hasHydrated && !hydrationTimedOut)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ed0b0bff" />
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
