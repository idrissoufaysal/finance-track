import { Transaction, Budget } from '@/types/finance';
import { toISODate } from '@/utils/dateUtils';

export const DEFAULT_BUDGETS: Budget[] = [
  { categoryId: 'food', monthlyLimit: 450 },
  { categoryId: 'housing', monthlyLimit: 950 },
  { categoryId: 'transport', monthlyLimit: 120 },
  { categoryId: 'shopping', monthlyLimit: 200 },
  { categoryId: 'entertainment', monthlyLimit: 150 },
  { categoryId: 'health', monthlyLimit: 100 },
  { categoryId: 'bills', monthlyLimit: 120 },
  { categoryId: 'other_expense', monthlyLimit: 150 },
];

/**
 * Optional demo generator if the user explicitly wants sample data in the future
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

  addTx(0, '08:45', 'Café & Croissant', 3.80, 'expense', 'food', 'apple_pay');
  addTx(0, '12:30', 'Déjeuner brasserie', 18.50, 'expense', 'food', 'card');
  addTx(1, '19:40', 'Courses alimentation', 74.30, 'expense', 'food', 'card');
  addTx(2, '10:00', 'Virement Freelance', 480.00, 'income', 'freelance', 'transfer');
  addTx(8, '07:30', 'Salaire Net', 2950.00, 'income', 'salary', 'transfer');
  addTx(8, '10:00', 'Loyer appartement', 890.00, 'expense', 'housing', 'transfer');

  return txs;
}
