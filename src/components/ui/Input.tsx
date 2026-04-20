import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

type InputVariant = "default" | "filled" | "outlined";
type InputSize = "sm" | "md" | "lg";

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  hint?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureToggle?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const sizeMap: Record<InputSize, { height: number; fontSize: number; paddingHorizontal: number }> =
  {
    sm: { height: 36, fontSize: 13, paddingHorizontal: 10 },
    md: { height: 44, fontSize: 15, paddingHorizontal: 14 },
    lg: { height: 52, fontSize: 17, paddingHorizontal: 16 },
  };

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  variant = "outlined",
  size = "md",
  error,
  hint,
  disabled = false,
  leftIcon,
  rightIcon,
  secureToggle = false,
  containerStyle,
  inputStyle,
  labelStyle,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureToggle);

  const { height, fontSize, paddingHorizontal } = sizeMap[size];

  const getBorderColor = () => {
    if (error) return "#EF4444";
    if (isFocused) return "#6366F1";
    return "#D1D5DB";
  };

  const getBackgroundColor = () => {
    if (disabled) return "#F3F4F6";
    if (variant === "filled") return "#F9FAFB";
    return "#FFFFFF";
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            height,
            paddingHorizontal,
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: variant === "outlined" ? 1.5 : 0,
            borderBottomWidth: variant === "default" ? 1.5 : undefined,
          },
          isFocused && styles.focused,
        ]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}

        <TextInput
          style={[
            styles.input,
            { fontSize },
            leftIcon ? { paddingLeft: 8 } : undefined,
            (rightIcon || secureToggle) ? { paddingRight: 8 } : undefined,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!disabled}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />

        {secureToggle ? (
          <TouchableOpacity
            onPress={() => setIsSecure((prev) => !prev)}
            style={styles.rightIcon}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleText}>{isSecure ? "Show" : "Hide"}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.rightIcon}>{rightIcon}</View>
        ) : null}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
  },
  focused: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: "#111827",
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: "#EF4444",
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
});
