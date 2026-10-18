import React from "react";
import { StyleSheet, Text, TextProps, StyleProp, TextStyle } from "react-native";
import { colors, font, fontSizes, type ColorToken, type FontSizeToken, type FontWeightToken } from "@/theme";

type Variant = FontSizeToken;
type Weight = FontWeightToken;

interface ThemedTextProps extends TextProps {
  variant?: Variant;
  weight?: Weight;
  /** Token warna dari theme — untuk warna kustom gunakan style */
  color?: ColorToken;
  uppercase?: boolean;
  style?: StyleProp<TextStyle>;
}

/** Teks dengan token tipografi Plus Jakarta Sans. */
export function ThemedText({
  variant = "sm",
  weight = "regular",
  color = "ink",
  uppercase = false,
  style,
  children,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily: font[weight],
          fontSize: fontSizes[variant],
          color: colors[color],
        },
        uppercase && styles.uppercase,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  uppercase: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
