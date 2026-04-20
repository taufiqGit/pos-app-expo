import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const SAMPLE_PRODUCTS = [
  { id: '1', name: 'Coffee', price: 3.5 },
  { id: '2', name: 'Tea', price: 2.5 },
  { id: '3', name: 'Sandwich', price: 6.0 },
  { id: '4', name: 'Muffin', price: 3.0 },
  { id: '5', name: 'Juice', price: 4.0 },
  { id: '6', name: 'Water', price: 1.5 },
];

export default function POSScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Point of Sale</Text>
        <Text style={styles.headerSubtitle}>{itemCount} item(s) in cart</Text>
      </View>

      <View style={styles.body}>
        {/* Product Grid */}
        <View style={styles.productsPanel}>
          <Text style={styles.panelTitle}>Products</Text>
          <FlatList
            data={SAMPLE_PRODUCTS}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => addToCart(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Cart Panel */}
        <View style={styles.cartPanel}>
          <Text style={styles.panelTitle}>Cart</Text>

          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>No items added yet</Text>
            </View>
          ) : (
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              style={styles.cartList}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <Text style={styles.cartItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.cartItemControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => addToCart(item)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          {/* Total & Actions */}
          <View style={styles.cartFooter}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, cart.length === 0 && styles.disabledBtn]}
              disabled={cart.length === 0}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            {cart.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
                <Text style={styles.clearBtnText}>Clear Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a45',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#a0a0c0',
    fontSize: 13,
    marginTop: 2,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  productsPanel: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#2a2a45',
  },
  panelTitle: {
    color: '#c0c0e0',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#1e1e35',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2e2e55',
  },
  productName: {
    color: '#e0e0ff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  productPrice: {
    color: '#7c6fff',
    fontSize: 15,
    fontWeight: '700',
  },
  cartPanel: {
    width: 280,
    padding: 12,
    backgroundColor: '#12122a',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    color: '#555577',
    fontSize: 14,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: '#1e1e35',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2e2e55',
  },
  cartItemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cartItemName: {
    color: '#e0e0ff',
    fontSize: 14,
    fontWeight: '500',
  },
  cartItemPrice: {
    color: '#7c6fff',
    fontSize: 14,
    fontWeight: '700',
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  qtyBtn: {
    backgroundColor: '#2e2e55',
    borderRadius: 6,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  qtyText: {
    color: '#e0e0ff',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  cartFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2a2a45',
    marginTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalLabel: {
    color: '#a0a0c0',
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  checkoutBtn: {
    backgroundColor: '#7c6fff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  disabledBtn: {
    backgroundColor: '#3a3a55',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  clearBtn: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  clearBtnText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
  },
});
