/**
 * Design tokens warna SmartPOS.
 * Sumber: mockup HTML (Tailwind) — primary #F49E4A, bg cream #F5F1E8.
 * Aturan: screen & komponen import dari sini, tidak hardcode hex.
 */
export const colors = {
  // Brand
  primary: "#F49E4A",
  primaryDark: "#E88D36",
  primarySoft: "#FFF9F3", // bg pilihan aktif (metode pembayaran)
  onPrimary: "#FFFFFF",

  // Permukaan
  bg: "#F5F1E8", // cream
  card: "#FFFFFF",
  surfaceMuted: "#F3F4F6", // gray-100 — icon button, stepper
  inputBg: "#F9FAFB", // gray-50 — field input

  // Teks
  ink: "#111827", // gray-900 — teks utama & tombol dark
  inkSoft: "#1F2937", // gray-800
  textSecondary: "#6B7280", // gray-500
  muted: "#9CA3AF", // gray-400
  faint: "#D1D5DB", // gray-300

  // Garis & border
  line: "#F3F4F6", // gray-100 — divider solid
  lineStrong: "#E5E7EB", // gray-200 — divider dashed
  cardBorder: "rgba(244, 158, 74, 0.10)", // orange-50/50 di atas putih

  // Status: sukses
  success: "#16A34A", // green-600
  successBg: "#F0FDF4", // green-50
  successBorder: "#DCFCE7", // green-100

  // Status: gagal / refund / diskon
  danger: "#EF4444", // red-500
  dangerText: "#DC2626", // red-600
  dangerBg: "#FEF2F2", // red-50
  dangerBorder: "#FECACA", // red-100

  // Aksen informatif
  info: "#3B82F6", // blue-500
  infoBg: "#EFF6FF", // blue-50
  infoBorder: "#DBEAFE", // blue-100
  purple: "#8B5CF6",
  purpleBg: "#F5F3FF",

  // Chip tint
  orangeBg: "#FFF7ED", // orange-50
  orangeBorder: "#FFEDD5", // orange-100

  white: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
