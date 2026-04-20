import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  primary: {
    container: { backgroundColor: "#4F46E5" },
    text: { color: "#FFFFFF" },
  },
  secondary: {
    container: { backgroundColor: "#6B7280" },
    text: { color: "#FFFFFF" },
  },
  danger: {
    container: { backgroundColor: "#EF4444" },
    text: { color: "#FFFFFF" },
  },
  ghost: {
    container: { backgroundColor: "transparent" },
    text: { color: "#4F46E5" },
  },
  outline: {
    container: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: "#4F46E5" },
    text: { color: "#4F46E5" },
  },
};

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    text: { fontSize: 13, fontWeight: "500" },
  },
  md: {
    container: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
    text: { fontSize: 15, fontWeight: "600" },
  },
  lg: {
    container: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10 },
    text: { fontSize: 17, fontWeight: "700" },
  },
};

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        variantStyles[variant].container,
        sizeStyles[size].container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "ghost" || variant === "outline" ? "#4F46E5" : "#FFFFFF"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variantStyles[variant].text,
            sizeStyles[size].text,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
  text: {
    letterSpacing: 0.3,
  },
});

export default Button;
