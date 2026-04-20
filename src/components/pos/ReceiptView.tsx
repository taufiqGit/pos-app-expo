import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total: number;
}

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  time: string;
  cashierName: string;
  items: ReceiptItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount?: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: "cash" | "card" | "digital_wallet";
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
  notes?: string;
}

interface ReceiptViewProps {
  receipt: ReceiptData;
  onPrint?: () => void;
  onShare?: () => void;
  onClose?: () => void;
  showActions?: boolean;
}

const PAYMENT_METHOD_LABEL: Record<ReceiptData["paymentMethod"], string> = {
  cash: "Cash",
  card: "Credit / Debit Card",
  digital_wallet: "Digital Wallet",
};

const formatCurrency = (amount: number): string =>
  `$${amount.toFixed(2)}`;

const Divider: React.FC<{ dashed?: boolean }> = ({ dashed = false }) => (
  <Text style={[styles.divider, dashed && styles.dividerDashed]}>
    {dashed
      ? "- - - - - - - - - - - - - - - - - - - - - - - - - - - -"
      : "────────────────────────────────────"}
  </Text>
);

const ReceiptView: React.FC<ReceiptViewProps> = ({
  receipt,
  onPrint,
  onShare,
  onClose,
  showActions = true,
}) => {
  const {
    receiptNumber,
    date,
    time,
    cashierName,
    items,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    total,
    amountPaid,
    change,
    paymentMethod,
    storeName = "My POS Store",
    storeAddress,
    storePhone,
    notes,
  } = receipt;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Header */}
        <View style={styles.header}>
          <Text style={styles.storeName}>{storeName}</Text>
          {storeAddress && (
            <Text style={styles.storeInfo}>{storeAddress}</Text>
          )}
          {storePhone && (
            <Text style={styles.storeInfo}>Tel: {storePhone}</Text>
          )}
        </View>

        <Divider />

        {/* Receipt Meta */}
        <View style={styles.meta}>
          <Row label="Receipt #" value={receiptNumber} />
          <Row label="Date" value={date} />
          <Row label="Time" value={time} />
          <Row label="Cashier" value={cashierName} />
          <Row label="Payment" value={PAYMENT_METHOD_LABEL[paymentMethod]} />
        </View>

        <Divider dashed />

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={[styles.itemCol, styles.itemName, styles.labelText]}>
            ITEM
          </Text>
          <Text style={[styles.itemCol, styles.itemQty, styles.labelText]}>
            QTY
          </Text>
          <Text style={[styles.itemCol, styles.itemPrice, styles.labelText]}>
            PRICE
          </Text>
          <Text style={[styles.itemCol, styles.itemTotal, styles.labelText]}>
            TOTAL
          </Text>
        </View>

        <Divider dashed />

        {/* Items List */}
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text
              style={[styles.itemCol, styles.itemName]}
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text style={[styles.itemCol, styles.itemQty]}>
              {item.quantity}
            </Text>
            <Text style={[styles.itemCol, styles.itemPrice]}>
              {formatCurrency(item.unitPrice)}
            </Text>
            <Text style={[styles.itemCol, styles.itemTotal]}>
              {formatCurrency(item.total)}
            </Text>
            {item.discount !== undefined && item.discount > 0 && (
              <Text style={styles.itemDiscount}>
                Discount: -{formatCurrency(item.discount)}
              </Text>
            )}
          </View>
        ))}

        <Divider />

        {/* Totals */}
        <View style={styles.totals}>
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          {discountAmount !== undefined && discountAmount > 0 && (
            <Row
              label="Discount"
              value={`-${formatCurrency(discountAmount)}`}
              valueStyle={styles.discountText}
            />
          )}
          <Row
            label={`Tax (${(taxRate * 100).toFixed(0)}%)`}
            value={formatCurrency(taxAmount)}
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <Divider dashed />

        {/* Payment Summary */}
        <View style={styles.payment}>
          <Row label="Amount Paid" value={formatCurrency(amountPaid)} />
          <Row label="Change" value={formatCurrency(change)} />
        </View>

        <Divider />

        {/* Notes */}
        {notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your purchase!</Text>
          <Text style={styles.footerSub}>Please come again</Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actions}>
          {onPrint && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.printBtn]}
              onPress={onPrint}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>🖨️  Print</Text>
            </TouchableOpacity>
          )}
          {onShare && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.shareBtn]}
              onPress={onShare}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnText}>📤  Share</Text>
            </TouchableOpacity>
          )}
          {onClose && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.closeBtn]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={[styles.actionBtnText, styles.closeBtnText]}>
                ✕  Close
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

/* ─── Helper Sub-component ─────────────────────────────────────────────────── */

interface RowProps {
  label: string;
  value: string;
  valueStyle?: object;
}

const Row: React.FC<RowProps> = ({ label, value, valueStyle }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
  </View>
);

/* ─── Styles ────────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scroll: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  storeInfo: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },

  // Divider
  divider: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 11,
    marginVertical: 8,
    letterSpacing: 0,
  },
  dividerDashed: {
    color: "#ddd",
    letterSpacing: 0,
  },

  // Meta
  meta: {
    marginBottom: 4,
  },

  // Item columns
  itemsHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  itemRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 6,
  },
  itemCol: {
    fontSize: 12,
    color: "#333",
  },
  itemName: {
    flex: 3,
    paddingRight: 4,
  },
  itemQty: {
    flex: 1,
    textAlign: "center",
  },
  itemPrice: {
    flex: 2,
    textAlign: "right",
  },
  itemTotal: {
    flex: 2,
    textAlign: "right",
    fontWeight: "600",
  },
  itemDiscount: {
    width: "100%",
    fontSize: 11,
    color: "#e53935",
    paddingLeft: 4,
    marginTop: -2,
  },
  labelText: {
    fontWeight: "700",
    color: "#555",
    fontSize: 11,
    textTransform: "uppercase",
  },

  // Totals
  totals: {
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  discountText: {
    color: "#e53935",
  },

  // Payment
  payment: {
    marginBottom: 4,
  },

  // Generic row
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  rowLabel: {
    fontSize: 13,
    color: "#555",
  },
  rowValue: {
    fontSize: 13,
    color: "#1a1a1a",
    fontWeight: "500",
  },

  // Notes
  notes: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#fafafa",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#6c63ff",
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6c63ff",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },

  // Footer
  footer: {
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  footerSub: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  // Action buttons
  actions: {
    flexDirection: "row",
    padding: 16,
    paddingTop: 8,
    gap: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  printBtn: {
    backgroundColor: "#6c63ff",
  },
  shareBtn: {
    backgroundColor: "#43a047",
  },
  closeBtn: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  closeBtnText: {
    color: "#555",
  },
});

export default ReceiptView;
