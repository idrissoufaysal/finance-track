import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/finance';
import { generateDemoTransactions } from './storageShared';

export { generateDemoTransactions } from './storageShared';

/**
 * Web fallback storage (AsyncStorage → localStorage).
 * expo-sqlite on web is alpha and needs extra wasm/COOP setup, so the browser
 * preview keeps this lightweight implementation. Same API as `storage.ts`.
 */

const STORAGE_KEY_TRANSACTIONS = '@finance_track_transactions_v3';

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

/* ---------------------------------- Demo ---------------------------------- */

export async function resetStorageToDemo(): Promise<{ transactions: Transaction[] }> {
  const transactions = generateDemoTransactions();
  await writeArray(STORAGE_KEY_TRANSACTIONS, transactions);
  return { transactions };
}
