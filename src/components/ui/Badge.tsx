import React from "react";
import { StyleSheet, StyleProp, Text, TextStyle, View, ViewStyle } from "react-native";
import { colors, font } from "@/theme";

type BadgeVariant = "success" | "danger" | "info" | "warning" | "neutral";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  success: {
    container: { backgroundColor: colors.successBg },
    text: { color: colors.success },
  },
  danger: {
    container: { backgroundColor: colors.dangerBg },
    text: { color: colors.dangerText },
  },
  info: {
    container: { backgroundColor: colors.infoBg },
    text: { color: colors.info },
  },
  warning: {
    container: { backgroundColor: colors.orangeBg },
    text: { color: colors.primary },
  },
  neutral: {
    container: { backgroundColor: colors.surfaceMuted },
    text: { color: colors.textSecondary },
  },
};

const sizeStyles: Record<BadgeSize, { container: ViewStyle; fontSize: 9 | 10 }> = {
  sm: {
    container: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    fontSize: 9,
  },
  md: {
    container: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
    fontSize: 10,
  },
};

/** Chip status kecil — semua uppercase bold sesuai mockup (Success/Refunded/DINE-IN/TERHUBUNG). */
const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "neutral",
  size = "sm",
  style,
  textStyle,
}) => {
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <View
      accessibilityLabel={label}
      style={[
        styles.container,
        currentVariant.container,
        currentSize.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          currentVariant.text,
          { fontSize: currentSize.fontSize },
          textStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: font.bold,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default Badge;
