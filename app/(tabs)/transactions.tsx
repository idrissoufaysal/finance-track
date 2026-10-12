import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import { TransactionItem } from '@/components/TransactionItem';
import { PeriodSelector } from '@/components/PeriodSelector';
import { EmptyState } from '@/components/EmptyState';
import { ALL_CATEGORIES } from '@/constants/categories';
import { formatCurrency } from '@/utils/dateUtils';

export default function TransactionsScreen() {
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { filteredTransactions, periodSummary } = useFinance();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtered transactions
  const displayedTransactions = useMemo(() => {
    return filteredTransactions.filter((tx) => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Category filter
      if (selectedCategory && tx.categoryId !== selectedCategory) return false;
      // Search text
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchNote = tx.note?.toLowerCase().includes(query);
        if (!matchTitle && !matchNote) return false;
      }
      return true;
    });
  }, [filteredTransactions, typeFilter, selectedCategory, search]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      {/* Search & Top Action */}
      <View style={[styles.topHeader, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.surfaceSecondary }]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Rechercher une transaction..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        <Pressable
          onPress={() => router.push('/new-transaction')}
          style={({ pressed }) => [
            styles.plusBtn,
            { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        style={[styles.scroll, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector (Day / Week / Month) */}
        <PeriodSelector />

        {/* Type Filter Buttons */}
        <View style={styles.filterRow}>
          {(['all', 'expense', 'income'] as const).map((t) => {
            const isActive = typeFilter === t;
            const label = t === 'all' ? 'Toutes' : t === 'expense' ? 'Dépenses' : 'Revenus';
            return (
              <Pressable
                key={t}
                onPress={() => setTypeFilter(t)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive ? colors.tint : colors.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isActive ? '#fff' : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Quick Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={[
              styles.chip,
              {
                backgroundColor:
                  selectedCategory === null ? colors.text : colors.surfaceSecondary,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selectedCategory === null ? colors.surface : colors.textSecondary },
              ]}
            >
              Toutes catégories
            </Text>
          </Pressable>

          {ALL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? cat.color : colors.surfaceSecondary,
                  },
                ]}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isSelected ? '#fff' : cat.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? '#fff' : colors.textSecondary },
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Results summary */}
        <View style={styles.resultsInfoRow}>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {displayedTransactions.length} opération{displayedTransactions.length > 1 ? 's' : ''}
          </Text>
          <Text style={[styles.resultsTotal, { color: colors.text, fontVariant: ['tabular-nums'] }]}>
            {formatCurrency(
              displayedTransactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0)
            )}
          </Text>
        </View>

        {/* Transactions list */}
        {displayedTransactions.length === 0 ? (
          <EmptyState
            title="Aucun résultat"
            subtitle="Modifiez vos critères de recherche ou ajoutez une transaction."
          />
        ) : (
          <View
            style={[
              styles.listCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            {displayedTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} showDate={true} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterPillText: {
    fontSize: 13,
  },
  categoryChips: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultsTotal: {
    fontSize: 14,
    fontWeight: '700',
  },
  listCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
});
