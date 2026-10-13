import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget } from '@/types/finance';
import { toISODate } from '@/utils/dateUtils';

// v2 storage keys starting completely clean with 0 transactions
const STORAGE_KEY_TRANSACTIONS = '@finance_track_transactions_v2';
const STORAGE_KEY_BUDGETS = '@finance_track_budgets_v3_fcfa';

let memoryTransactions: Transaction[] | null = [];
let memoryBudgets: Budget[] | null = null;

export const DEFAULT_BUDGETS: Budget[] = [
  { categoryId: 'food', monthlyLimit: 100000 },
  { categoryId: 'housing', monthlyLimit: 250000 },
  { categoryId: 'transport', monthlyLimit: 30000 },
  { categoryId: 'shopping', monthlyLimit: 50000 },
  { categoryId: 'entertainment', monthlyLimit: 30000 },
  { categoryId: 'health', monthlyLimit: 25000 },
  { categoryId: 'bills', monthlyLimit: 30000 },
  { categoryId: 'other_expense', monthlyLimit: 30000 },
];

/**
 * Loads transactions from storage. Starts with 0 transactions (empty array) by default.
 */
export async function loadTransactions(): Promise<Transaction[]> {
  try {
    // Clear old v1 demo keys if present
    try {
      await AsyncStorage.removeItem('@finance_track_transactions_v1');
    } catch {}

    const raw = await AsyncStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (!raw) {
      // Initial state: 0 transactions
      memoryTransactions = [];
      await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    memoryTransactions = Array.isArray(parsed) ? parsed : [];
    return memoryTransactions;
  } catch (error) {
    console.warn('Storage read fallback for transactions:', error);
    if (!memoryTransactions) {
      memoryTransactions = [];
    }
    return memoryTransactions;
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  memoryTransactions = transactions;
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.warn('Storage save error:', error);
  }
}

export async function clearAllTransactions(): Promise<Transaction[]> {
  memoryTransactions = [];
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify([]));
    await AsyncStorage.removeItem('@finance_track_transactions_v1');
  } catch {}
  return [];
}

export async function loadBudgets(): Promise<Budget[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_BUDGETS);
    if (!raw) {
      memoryBudgets = DEFAULT_BUDGETS;
      await AsyncStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(DEFAULT_BUDGETS));
      return DEFAULT_BUDGETS;
    }
    const parsed = JSON.parse(raw);
    memoryBudgets = Array.isArray(parsed) ? parsed : DEFAULT_BUDGETS;
    return memoryBudgets;
  } catch (error) {
    console.warn('Storage read fallback for budgets:', error);
    if (!memoryBudgets) {
      memoryBudgets = DEFAULT_BUDGETS;
    }
    return memoryBudgets;
  }
}

export async function saveBudgets(budgets: Budget[]): Promise<void> {
  memoryBudgets = budgets;
  try {
    await AsyncStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
  } catch (error) {
    console.warn('Storage save budgets error:', error);
  }
}

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

  addTx(0, '08:45', 'Café & Croissant', 1500, 'expense', 'food', 'apple_pay');
  addTx(0, '12:30', 'Déjeuner brasserie', 5000, 'expense', 'food', 'card');
  addTx(1, '19:40', 'Courses alimentation', 25000, 'expense', 'food', 'card');
  addTx(2, '10:00', 'Virement Freelance', 150000, 'income', 'freelance', 'transfer');
  addTx(8, '07:30', 'Salaire Net', 350000, 'income', 'salary', 'transfer');
  addTx(8, '10:00', 'Loyer appartement', 150000, 'expense', 'housing', 'transfer');

  return txs;
}

export async function resetStorageToDemo(): Promise<{ transactions: Transaction[]; budgets: Budget[] }> {
  const transactions = generateDemoTransactions();
  const budgets = DEFAULT_BUDGETS;
  memoryTransactions = transactions;
  memoryBudgets = budgets;
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    await AsyncStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(budgets));
  } catch {}
  return { transactions, budgets };
}
