import React, { useState } from 'react';
import {
  Alert,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { Button } from '../../components/UI';
import { theme } from '../../theme';

export default function CheckoutScreen({ navigation }: any) {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const placeOrder = async () => {
    if (!user || !items.length) {
      Alert.alert('Error', 'Your cart is empty or you are not logged in.');
      return;
    }

    try {
      setBusy(true);
      const fn = httpsCallable(getFunctions(), 'createOrder');
      const r: any = await fn({
        items: items.map((i) => ({ foodId: i.id, quantity: i.quantity })),
        paymentMethod: 'PAY_AT_COUNTER',
      });
      clear();
      navigation.replace('Confirmation', { order: r.data });
    } catch (e: any) {
      Alert.alert('Order failed', e?.message || 'Could not place order.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Payment Method Card */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.paymentCard}>
          <View style={styles.paymentRow}>
            <View style={styles.iconBg}>
              <Ionicons name="cash-outline" size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>Pay at Counter / Cash</Text>
              <Text style={styles.paymentSub}>Pay directly when receiving your food</Text>
            </View>
            <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
          </View>
        </View>

        {/* Order Summary Card */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Items</Text>
            <Text style={styles.summaryValue}>{items.reduce((sum, i) => sum + i.quantity, 0)} Items</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Checkout Action */}
      <View style={styles.footer}>
        <View style={styles.footerPriceRow}>
          <Text style={styles.footerPriceLabel}>Total Payable</Text>
          <Text style={styles.footerPriceValue}>₹{total}</Text>
        </View>
        <Button
          title={busy ? 'Placing Order…' : 'Place Order'}
          onPress={placeOrder}
          disabled={busy || !items.length}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: theme.typography.brandTitle,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  sectionTitle: {
    fontSize: theme.typography.sectionTitle,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 12,
  },
  paymentCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  paymentSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  summaryText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  footerPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerPriceLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  footerPriceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
  },
});