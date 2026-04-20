import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const stats = [
  { label: "Today's Sales", value: '$1,240.00', color: '#4F46E5' },
  { label: 'Orders', value: '34', color: '#059669' },
  { label: 'Avg. Order', value: '$36.47', color: '#D97706' },
  { label: 'Refunds', value: '2', color: '#DC2626' },
];

const quickActions = [
  { label: 'New Sale', icon: '🛒', route: '/pos' },
  { label: 'Products', icon: '📦', route: '/products' },
  { label: 'Reports', icon: '📊', route: '/reports' },
  { label: 'Settings', icon: '⚙️', route: '/(tabs)' },
];

const recentOrders = [
  { id: '#1023', customer: 'Walk-in', total: '$52.00', status: 'Paid', time: '2 min ago' },
  { id: '#1022', customer: 'John Doe', total: '$18.50', status: 'Paid', time: '15 min ago' },
  { id: '#1021', customer: 'Walk-in', total: '$73.00', status: 'Refunded', time: '42 min ago' },
  { id: '#1020', customer: 'Jane Smith', total: '$29.99', status: 'Paid', time: '1 hr ago' },
];

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.shopName}>My POS Store</Text>
          </View>
          <TouchableOpacity style={styles.avatarButton}>
            <Text style={styles.avatarText}>A</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.route as any)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <View style={styles.ordersCard}>
          {recentOrders.map((order, index) => (
            <View
              key={order.id}
              style={[
                styles.orderRow,
                index < recentOrders.length - 1 && styles.orderRowBorder,
              ]}
            >
              <View style={styles.orderLeft}>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
              </View>
              <View style={styles.orderRight}>
                <Text style={styles.orderTotal}>{order.total}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    order.status === 'Refunded'
                      ? styles.statusRefunded
                      : styles.statusPaid,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      order.status === 'Refunded'
                        ? styles.statusTextRefunded
                        : styles.statusTextPaid,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderTime}>{order.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  shopName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  avatarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  ordersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  orderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  orderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  orderCustomer: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  orderRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  statusPaid: {
    backgroundColor: '#D1FAE5',
  },
  statusRefunded: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextPaid: {
    color: '#065F46',
  },
  statusTextRefunded: {
    color: '#991B1B',
  },
  orderTime: {
    fontSize: 11,
    color: '#94A3B8',
    minWidth: 60,
    textAlign: 'right',
  },
  bottomPad: {
    height: 32,
  },
});
