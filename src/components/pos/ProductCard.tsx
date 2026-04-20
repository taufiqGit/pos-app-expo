import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from "react-native";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  sku?: string;
  stock?: number;
  tax?: number;
}

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  style?: ViewStyle;
  currency?: string;
  showStock?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
  currency = "$",
  showStock = false,
}) => {
  const isOutOfStock = showStock && product.stock !== undefined && product.stock <= 0;

  return (
    <TouchableOpacity
      style={[styles.card, isOutOfStock && styles.cardDisabled, style]}
      onPress={() => !isOutOfStock && onPress(product)}
      activeOpacity={isOutOfStock ? 1 : 0.7}
      accessible
      accessibilityLabel={`${product.name}, ${currency}${product.price.toFixed(2)}`}
      accessibilityRole="button"
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>
              {product.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        {isOutOfStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {product.sku && (
          <Text style={styles.sku} numberOfLines={1}>
            SKU: {product.sku}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>
            {currency}
            {product.price.toFixed(2)}
          </Text>

          {showStock && product.stock !== undefined && (
            <Text
              style={[
                styles.stock,
                product.stock <= 5 && product.stock > 0 && styles.stockLow,
                product.stock <= 0 && styles.stockEmpty,
              ]}
            >
              {product.stock > 0 ? `${product.stock} left` : "0"}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    margin: 6,
    flex: 1,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F3F4F6",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  imagePlaceholderText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  info: {
    padding: 10,
    gap: 4,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 18,
  },
  sku: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },
  stock: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6B7280",
  },
  stockLow: {
    color: "#D97706",
  },
  stockEmpty: {
    color: "#EF4444",
  },
});

export default ProductCard;
