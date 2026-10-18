/** Radius dari mockup (rounded-md 6, lg 8, xl 12, 2xl 16, [20], [24] kartu, [32] hero). */
export const radius = {
  xs: 6, // tombol kecil (stepper 24px)
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 24,
  hero: 32,
  full: 999,
} as const;

export type RadiusToken = keyof typeof radius;
