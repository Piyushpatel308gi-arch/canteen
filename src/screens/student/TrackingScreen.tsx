import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Order } from '../../types';
import { theme } from '../../theme';

const steps = ['PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COLLECTED'];

export default function TrackingScreen({ route, navigation }: any) {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'orders', route.params.orderId),
      (snapshot) => {
        if (snapshot.exists()) {
          setOrder({ id: snapshot.id, ...snapshot.data() } as Order);
        }
      }
    );

    return () => unsubscribe();
  }, [route.params.orderId]);

  if (!order) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Fetching order status…</Text>
      </View>
    );
  }

  const currentStepIndex = Math.max(0, steps.indexOf(order.status));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Token Banner */}
        <View style={styles.tokenCard}>
          <Text style={styles.tokenLabel}>Token Number</Text>
          <Text style={styles.tokenValue}>#{order.tokenNumber}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{order.status}</Text>
          </View>
        </View>

        {/* Rejection Alert */}
        {order.rejectionReason && (
          <View style={styles.rejectionCard}>
            <Ionicons name="alert-circle-outline" size={22} color={theme.colors.danger} />
            <View style={styles.rejectionContent}>
              <Text style={styles.rejectionTitle}>Order Declined</Text>
              <Text style={styles.rejectionText}>Reason: {order.rejectionReason}</Text>
            </View>
          </View>
        )}

        {/* Timeline Tracking */}
        <Text style={styles.sectionTitle}>Order Progress</Text>
        <View style={styles.timelineCard}>
          {steps.map((step, i) => {
            const isCompleted = i <= currentStepIndex;
            const isLast = i === steps.length - 1;

            return (
              <View key={step} style={styles.timelineItem}>
                <View style={styles.timelineIconColumn}>
                  <View
                    style={[
                      styles.circle,
                      isCompleted ? styles.circleCompleted : styles.circlePending,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    ) : (
                      <View style={styles.innerDot} />
                    )}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.line,
                        i < currentStepIndex ? styles.lineCompleted : styles.linePending,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineTextColumn}>
                  <Text
                    style={[
                      styles.stepText,
                      isCompleted ? styles.stepTextCompleted : styles.stepTextPending,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
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
  tokenCard: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  tokenValue: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.primary,
    marginVertical: 4,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rejectionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
    gap: 10,
  },
  rejectionContent: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.danger,
  },
  rejectionText: {
    fontSize: 12,
    color: theme.colors.danger,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: theme.typography.sectionTitle,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  timelineCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineIconColumn: {
    alignItems: 'center',
    width: 30,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleCompleted: {
    backgroundColor: theme.colors.primary,
  },
  circlePending: {
    backgroundColor: '#E0E0E0',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: theme.colors.primary,
  },
  linePending: {
    backgroundColor: '#E0E0E0',
  },
  timelineTextColumn: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  stepText: {
    fontSize: 14,
  },
  stepTextCompleted: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  stepTextPending: {
    color: theme.colors.textMuted,
  },
});