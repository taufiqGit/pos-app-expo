import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, radius, spacing } from "@/theme";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  style?: object;
}

/** State kosong — lingkaran abu + icon + judul (gaya "Tidak ada riwayat" mockup). */
export function EmptyState({ icon: Icon, title, subtitle, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Icon size={30} color={colors.faint} />
      </View>
      <ThemedText variant="sm" weight="bold" color="ink">
        {title}
      </ThemedText>
      {subtitle ? (
        <ThemedText variant="xs" color="muted">
          {subtitle}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
});
