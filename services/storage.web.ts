import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget } from '@/types/finance';
import { DEFAULT_BUDGETS, generateDemoTransactions } from './storageShared';

export { DEFAULT_BUDGETS, generateDemoTransactions } from './storageShared';

/**
 * Web fallback storage (AsyncStorage → localStorage).
 * expo-sqlite on web is alpha and needs extra wasm/COOP setup, so the browser
 * preview keeps this lightweight implementation. Same API as `storage.ts`.
 */

const STORAGE_KEY_TRANSACTIONS = '@finance_track_transactions_v2';
const STORAGE_KEY_BUDGETS = '@finance_track_budgets_v2';

async function readArray<T>(key: string): Promise<T[] | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function writeArray<T>(key: string, value: T[]): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Storage save error:', error);
  }
}

/* ------------------------------ Transactions ------------------------------ */

export async function loadTransactions(): Promise<Transaction[]> {
  return (await readArray<Transaction>(STORAGE_KEY_TRANSACTIONS)) ?? [];
}

export async function insertTransaction(tx: Transaction): Promise<void> {
  const all = await loadTransactions();
  await writeArray(STORAGE_KEY_TRANSACTIONS, [tx, ...all]);
}

export async function updateTransactionRecord(tx: Transaction): Promise<void> {
  const all = await loadTransactions();
  await writeArray(
    STORAGE_KEY_TRANSACTIONS,
    all.map((t) => (t.id === tx.id ? tx : t))
  );
}

export async function deleteTransactionRecord(id: string): Promise<void> {
  const all = await loadTransactions();
  await writeArray(
    STORAGE_KEY_TRANSACTIONS,
    all.filter((t) => t.id !== id)
  );
}

export async function clearAllTransactions(): Promise<Transaction[]> {
  await writeArray(STORAGE_KEY_TRANSACTIONS, []);
  return [];
}

/* --------------------------------- Budgets -------------------------------- */

export async function loadBudgets(): Promise<Budget[]> {
  const stored = await readArray<Budget>(STORAGE_KEY_BUDGETS);
  if (stored) return stored;
  await writeArray(STORAGE_KEY_BUDGETS, DEFAULT_BUDGETS);
  return DEFAULT_BUDGETS;
}

export async function upsertBudget(categoryId: string, monthlyLimit: number): Promise<void> {
  const all = await loadBudgets();
  const exists = all.some((b) => b.categoryId === categoryId);
  const updated = exists
    ? all.map((b) => (b.categoryId === categoryId ? { ...b, monthlyLimit } : b))
    : [...all, { categoryId, monthlyLimit }];
  await writeArray(STORAGE_KEY_BUDGETS, updated);
}

/* ---------------------------------- Demo ---------------------------------- */

export async function resetStorageToDemo(): Promise<{ transactions: Transaction[]; budgets: Budget[] }> {
  const transactions = generateDemoTransactions();
  const budgets = DEFAULT_BUDGETS;
  await writeArray(STORAGE_KEY_TRANSACTIONS, transactions);
  await writeArray(STORAGE_KEY_BUDGETS, budgets);
  return { transactions, budgets };
}
