import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/types/finance';
import { getCategoryById } from '@/constants/categories';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/dateUtils';

interface Props {
  transaction: Transaction;
  showDate?: boolean;
}

export function TransactionItem({ transaction, showDate = false }: Props) {
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { deleteTransaction } = useFinance();
  const category = getCategoryById(transaction.categoryId);

  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la transaction',
      `Voulez-vous supprimer "${transaction.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteTransaction(transaction.id),
        },
      ]
    );
  };

  const paymentIcon = 
    transaction.paymentMethod === 'apple_pay' ? 'logo-apple' :
    transaction.paymentMethod === 'card' ? 'card-outline' :
    transaction.paymentMethod === 'cash' ? 'cash-outline' : 'swap-horizontal-outline';

  return (
    <Pressable
      onLongPress={handleDelete}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderBottomColor: colors.borderSubtle,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      {/* Category Icon */}
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: category.color + '18' },
        ]}
      >
        <Ionicons name={category.icon as any} size={20} color={category.color} />
      </View>

      {/* Main Title & Subtitle */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {transaction.title}
        </Text>
        <View style={styles.subRow}>
          <Text style={[styles.categoryName, { color: colors.textSecondary }]}>
            {category.name}
          </Text>
          <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
          <Ionicons name={paymentIcon as any} size={11} color={colors.textMuted} />
          {showDate && (
            <>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.dateText, { color: colors.textMuted }]}>
                {transaction.date}
              </Text>
            </>
          )}
          {transaction.time && (
            <>
              <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
              <Text style={[styles.timeText, { color: colors.textMuted }]}>
                {transaction.time}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Amount */}
      <View style={styles.amountCol}>
        <Text
          style={[
            styles.amount,
            {
              color: isIncome ? colors.income : colors.expense,
              fontVariant: ['tabular-nums'],
            },
          ]}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    fontSize: 10,
  },
  dateText: {
    fontSize: 11,
  },
  timeText: {
    fontSize: 11,
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
