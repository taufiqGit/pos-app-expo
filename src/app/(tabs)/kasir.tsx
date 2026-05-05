import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

const QUICK_ITEMS = [
  { id: "1", name: "Kopi Susu", price: 18000 },
  { id: "2", name: "Americano", price: 15000 },
  { id: "3", name: "Roti Bakar", price: 22000 },
  { id: "4", name: "Croissant", price: 25000 },
];

export default function KasirScreen() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = QUICK_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (item: (typeof QUICK_ITEMS)[number]) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const decrement = (id: string) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const increment = (id: string) => {
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)),
    );
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Kasir</Text>
          <Text style={styles.subtitle}>Pilih produk dan buat transaksi</Text>
        </View>
        <TouchableOpacity style={styles.shiftButton} activeOpacity={0.85}>
          <Text style={styles.shiftButtonText}>Mulai Shift</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari produk..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.productsPanel}>
          <Text style={styles.panelTitle}>Produk Cepat</Text>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => addToCart(item)}
                activeOpacity={0.85}
              >
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  Rp {item.price.toLocaleString("id-ID")}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.cartPanel}>
          <Text style={styles.panelTitle}>Keranjang</Text>
          {cart.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartText}>
                Belum ada item di keranjang
              </Text>
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
                      Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => decrement(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => increment(item.id)}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          <View style={styles.cartFooter}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>
                Rp {total.toLocaleString("id-ID")}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                cart.length === 0 && styles.checkoutDisabled,
              ]}
              disabled={cart.length === 0}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutText}>Bayar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  subtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
  shiftButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shiftButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#E2E8F0",
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  productsPanel: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#1F2937",
  },
  cartPanel: {
    width: 280,
    padding: 12,
    backgroundColor: "#0F172A",
  },
  panelTitle: {
    color: "#CBD5F5",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  productName: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  productPrice: {
    color: "#A5B4FC",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCartText: {
    color: "#64748B",
    fontSize: 12,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cartItemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cartItemName: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  cartItemPrice: {
    color: "#A5B4FC",
    fontSize: 13,
    fontWeight: "700",
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  qtyBtn: {
    backgroundColor: "#1F2937",
    borderRadius: 6,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  qtyText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    marginHorizontal: 10,
    minWidth: 18,
    textAlign: "center",
  },
  cartFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  totalAmount: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "700",
  },
  checkoutBtn: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  checkoutDisabled: {
    backgroundColor: "#334155",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
