/**
 * Tipografi Plus Jakarta Sans — ramp ukuran dari mockup
 * (text-[10px], xs 12, sm 14, lg 18, xl 20, 2xl 24, 3xl 30).
 */
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

/** Nama family terdaftar via useFonts(fontAssets) — dipakai di style.fontFamily. */
export const font = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
} as const;

/** Asset font untuk useFonts() di root layout. */
export const fontAssets = {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
};

export const fontSizes = {
  micro: 10, // label kecil / uppercase kicker
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  hero: 30, // nominal total besar
} as const;

export type FontWeightToken = keyof typeof font;
export type FontSizeToken = keyof typeof fontSizes;

/** Shortcut style teks: family + weight. */
export const fontWeightStyles = {
  regular: { fontFamily: font.regular, fontWeight: "400" },
  medium: { fontFamily: font.medium, fontWeight: "500" },
  semiBold: { fontFamily: font.semiBold, fontWeight: "600" },
  bold: { fontFamily: font.bold, fontWeight: "700" },
} as const;
