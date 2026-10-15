import { Transaction, Budget } from '@/types/finance';
import { toISODate } from '@/utils/dateUtils';

export const DEFAULT_BUDGETS: Budget[] = [
  { categoryId: 'food', monthlyLimit: 150000 },
  { categoryId: 'housing', monthlyLimit: 250000 },
  { categoryId: 'transport', monthlyLimit: 50000 },
  { categoryId: 'shopping', monthlyLimit: 75000 },
  { categoryId: 'entertainment', monthlyLimit: 40000 },
  { categoryId: 'health', monthlyLimit: 30000 },
  { categoryId: 'bills', monthlyLimit: 45000 },
  { categoryId: 'other_expense', monthlyLimit: 35000 },
];

/**
 * Jeu de données de démonstration réaliste en FCFA
 */
export function generateDemoTransactions(): Transaction[] {
  const now = new Date();
  const txs: Transaction[] = [];

  const addTx = (
    daysOffset: number,
    time: string,
    title: string,
    amount: number,
    type: 'expense' | 'income',
    categoryId: string,
    paymentMethod: 'card' | 'cash' | 'transfer' | 'apple_pay' = 'card',
    note?: string
  ) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysOffset);
    txs.push({
      id: `seed_${daysOffset}_${time.replace(':', '')}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      amount,
      type,
      categoryId,
      date: toISODate(d),
      time,
      paymentMethod,
      note,
      createdAt: d.getTime(),
    });
  };

  addTx(0, '08:45', 'Café & Croissant', 2500, 'expense', 'food', 'cash');
  addTx(0, '12:30', 'Déjeuner restaurant', 8500, 'expense', 'food', 'card');
  addTx(1, '19:40', 'Courses supermarché', 34500, 'expense', 'food', 'card');
  addTx(2, '10:00', 'Virement Freelance', 250000, 'income', 'freelance', 'transfer');
  addTx(8, '07:30', 'Salaire mensuel', 750000, 'income', 'salary', 'transfer');
  addTx(8, '10:00', 'Loyer appartement', 180000, 'expense', 'housing', 'transfer');

  return txs;
}
