import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, motion, radius, shadows, spacing, type ColorToken } from "@/theme";

type ButtonVariant = "primary" | "dark" | "white" | "dangerSoft" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon lucide kiri label */
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; labelColor: ColorToken; iconColor: string }> = {
  primary: {
    container: { backgroundColor: colors.primary, ...shadows.raised, shadowColor: colors.primary, shadowOpacity: 0.35 },
    labelColor: "onPrimary",
    iconColor: colors.onPrimary,
  },
  dark: {
    container: { backgroundColor: colors.ink, ...shadows.raised },
    labelColor: "white",
    iconColor: colors.white,
  },
  white: {
    container: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.lineStrong },
    labelColor: "ink",
    iconColor: colors.ink,
  },
  dangerSoft: {
    container: { backgroundColor: colors.dangerBg, borderWidth: 1, borderColor: colors.dangerBorder },
    labelColor: "dangerText",
    iconColor: colors.dangerText,
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    labelColor: "primary",
    iconColor: colors.primary,
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; labelVariant: "xs" | "sm"; iconSize: number }> = {
  sm: {
    container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.md },
    labelVariant: "xs",
    iconSize: 14,
  },
  md: {
    container: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.lg },
    labelVariant: "sm",
    iconSize: 16,
  },
  lg: {
    container: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, borderRadius: radius.xl },
    labelVariant: "sm",
    iconSize: 18,
  },
};

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}) => {
  const isDisabled = disabled || loading;
  const current = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        current.container,
        currentSize.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={current.iconColor} />
      ) : (
        <>
          {Icon && <Icon size={currentSize.iconSize} color={current.iconColor} strokeWidth={2.4} />}
          <ThemedText variant={currentSize.labelVariant} weight="bold" color={current.labelColor}>
            {label}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },
});

export default Button;
