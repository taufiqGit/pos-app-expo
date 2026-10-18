import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, shadows, spacing, type SpacingToken } from "@/theme";

interface CardProps {
  /** Token padding internal — default "card" (16) */
  padding?: SpacingToken;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** Kartu putih radius 24 + border orange lembut — gaya semua kartu mockup. */
export function Card({ padding = "card", style, children }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        { padding: spacing[padding] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.card,
  },
});
