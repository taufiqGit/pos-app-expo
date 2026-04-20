import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: { backgroundColor: '#E5E7EB' },
    text: { color: '#374151' },
  },
  success: {
    container: { backgroundColor: '#D1FAE5' },
    text: { color: '#065F46' },
  },
  warning: {
    container: { backgroundColor: '#FEF3C7' },
    text: { color: '#92400E' },
  },
  danger: {
    container: { backgroundColor: '#FEE2E2' },
    text: { color: '#991B1B' },
  },
  info: {
    container: { backgroundColor: '#DBEAFE' },
    text: { color: '#1E40AF' },
  },
};

const sizeStyles: Record<BadgeSize, { container: ViewStyle; text: TextStyle }> = {
  sm: {
    container: { paddingHorizontal: 6, paddingVertical: 2 },
    text: { fontSize: 10 },
  },
  md: {
    container: { paddingHorizontal: 10, paddingVertical: 4 },
    text: { fontSize: 12 },
  },
  lg: {
    container: { paddingHorizontal: 14, paddingVertical: 6 },
    text: { fontSize: 14 },
  },
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <View
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
          currentSize.text,
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
    alignSelf: 'flex-start',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default Badge;
