import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import { PeriodSelector } from '@/components/PeriodSelector';
import { BalanceCard } from '@/components/BalanceCard';
import { FinanceChart } from '@/components/FinanceChart';
import { CategoryBreakdownCard } from '@/components/CategoryBreakdownCard';
import { TransactionItem } from '@/components/TransactionItem';
import { EmptyState } from '@/components/EmptyState';

export default function DashboardScreen() {
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { filteredTransactions, timeFrame } = useFinance();

  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.brandRow}>
          <View style={[styles.logoIcon, { backgroundColor: colors.tint }]}>
            <Ionicons name="trending-up" size={18} color="#fff" />
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: colors.text }]}>Finance Track</Text>
            <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
              Suivi Jour • Semaine • Mois
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push('/new-transaction')}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </Pressable>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector (Day / Week / Month) */}
        <PeriodSelector />

        {/* Hero Balance Card */}
        <BalanceCard />

        {/* Dynamic Chart (Day / Week / Month) */}
        <FinanceChart />

        {/* Category Breakdown */}
        <CategoryBreakdownCard />

        {/* Recent Transactions in Selected Period */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Opérations de la période
            </Text>
            {filteredTransactions.length > 5 && (
              <Pressable onPress={() => router.push('/(tabs)/transactions')}>
                <Text style={[styles.seeAllText, { color: colors.tint }]}>
                  Voir tout ({filteredTransactions.length})
                </Text>
              </Pressable>
            )}
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              title="Aucune opération trouvée"
              subtitle={`Aucune dépense ou revenu pour cette période (${
                timeFrame === 'day' ? 'journée' : timeFrame === 'week' ? 'semaine' : 'mois'
              }).`}
            />
          ) : (
            <View
              style={[
                styles.txCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {recentTransactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} showDate={timeFrame !== 'day'} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  recentSection: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  txCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
});
