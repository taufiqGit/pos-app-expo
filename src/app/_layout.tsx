import { Slot, usePathname, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { apiEvents } from "../services/apiEvents";
import { refreshTokens } from "../services/api";
import { authStorage } from "../services/authStorage";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useOutletStore } from "../store/outletStore";
import { colors, fontAssets } from "@/theme";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [hydrationTimedOut, setHydrationTimedOut] = useState(false);
  const { selectedOutlet, hasHydrated } = useOutletStore();
  const [fontsLoaded] = useFonts(fontAssets);

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
    if (hasHydrated) return;

    const timeout = setTimeout(() => {
      setHydrationTimedOut(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [hasHydrated]);

  useEffect(() => {
    const unsubscribe = apiEvents.on("unauthorized", async () => {
      await authStorage.clearTokens();
      useAuthStore.getState().clearUser();
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

      // Token valid tapi data user belum ada (mis. sesi lama sebelum persist)
      // → ambil ulang profil via GET /api/auth/access
      if (!useAuthStore.getState().user) {
        try {
          const access = await authService.getUserAccess();
          const { setUser } = useAuthStore.getState();
          setUser({
            id: access.id,
            username: access.username,
            email: access.email,
            phone: access.phone,
            company_id: access.company_id,
            role: access.role,
            active: access.active,
            is_owner: access.is_owner,
            created_at: access.created_at,
            updated_at: access.updated_at,
          });
        } catch {
          // Profil gagal diambil — biarkan screen tampilkan fallback
        }
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

  if (!isReady || !fontsLoaded || (!hasHydrated && !hydrationTimedOut)) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
});
