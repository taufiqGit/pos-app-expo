/** Grid 4pt — sumber: spacing mockup (p-3=12, p-4=16, p-5=20, p-6=24). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  /** Padding horizontal layar (px-5 mockup) */
  screen: 20,
  /** Padding standar kartu (p-4 mockup) */
  card: 16,
} as const;

export type SpacingToken = keyof typeof spacing;
