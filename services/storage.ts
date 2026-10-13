import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget, PaymentMethod, TransactionType } from '@/types/finance';
import { DEFAULT_BUDGETS, generateDemoTransactions } from './storageShared';

export { DEFAULT_BUDGETS, generateDemoTransactions } from './storageShared';

/**
 * Native storage (Android / iOS) backed by SQLite.
 * The database file lives on the device, so the app works fully offline.
 * Web uses `storage.web.ts` (AsyncStorage) with the same exported API.
 */

const DATABASE_NAME = 'finance-track.db';
const DATABASE_VERSION = 1;

// Legacy AsyncStorage keys, imported once into SQLite during the first migration.
const LEGACY_KEY_TRANSACTIONS = '@finance_track_transactions_v2';
const LEGACY_KEY_BUDGETS = '@finance_track_budgets_v2';

type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  type: string;
  category_id: string;
  date: string;
  time: string;
  note: string | null;
  payment_method: string | null;
  created_at: number;
};

type BudgetRow = {
  category_id: string;
  monthly_limit: number;
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await migrate(db);
      return db;
    })().catch((error) => {
      dbPromise = null; // allow a retry on next call
      throw error;
    });
  }
  return dbPromise;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = row?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) return;

  if (currentVersion === 0) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
        category_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        note TEXT,
        payment_method TEXT,
        created_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date);
      CREATE TABLE IF NOT EXISTS budgets (
        category_id TEXT PRIMARY KEY NOT NULL,
        monthly_limit REAL NOT NULL
      );
    `);

    // Import any data previously saved with AsyncStorage, otherwise seed default budgets.
    const [legacyTxRaw, legacyBudgetRaw] = await Promise.all([
      AsyncStorage.getItem(LEGACY_KEY_TRANSACTIONS).catch(() => null),
      AsyncStorage.getItem(LEGACY_KEY_BUDGETS).catch(() => null),
    ]);
    const legacyTxs = safeParseArray<Transaction>(legacyTxRaw);
    const legacyBudgets = safeParseArray<Budget>(legacyBudgetRaw);
    const budgetsToInsert = legacyBudgets.length > 0 ? legacyBudgets : DEFAULT_BUDGETS;

    await db.withTransactionAsync(async () => {
      for (const tx of legacyTxs) {
        await insertTransactionRow(db, tx, 'OR IGNORE');
      }
      for (const b of budgetsToInsert) {
        await db.runAsync(
          'INSERT OR IGNORE INTO budgets (category_id, monthly_limit) VALUES (?, ?)',
          b.categoryId,
          b.monthlyLimit
        );
      }
    });

    currentVersion = 1;
  }

  // Future migrations: if (currentVersion === 1) { ... currentVersion = 2; }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

function safeParseArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    type: row.type as TransactionType,
    categoryId: row.category_id,
    date: row.date,
    time: row.time,
    note: row.note ?? undefined,
    paymentMethod: (row.payment_method ?? undefined) as PaymentMethod | undefined,
    createdAt: row.created_at,
  };
}

async function insertTransactionRow(
  db: SQLite.SQLiteDatabase,
  tx: Transaction,
  conflict: 'OR IGNORE' | 'OR REPLACE' | '' = ''
): Promise<void> {
  await db.runAsync(
    `INSERT ${conflict} INTO transactions
      (id, title, amount, type, category_id, date, time, note, payment_method, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    tx.id,
    tx.title,
    tx.amount,
    tx.type,
    tx.categoryId,
    tx.date,
    tx.time ?? '',
    tx.note ?? null,
    tx.paymentMethod ?? null,
    tx.createdAt ?? Date.now()
  );
}

/* ------------------------------ Transactions ------------------------------ */

export async function loadTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TransactionRow>(
    'SELECT * FROM transactions ORDER BY date DESC, time DESC, created_at DESC'
  );
  return rows.map(rowToTransaction);
}

export async function insertTransaction(tx: Transaction): Promise<void> {
  const db = await getDb();
  await insertTransactionRow(db, tx);
}

export async function updateTransactionRecord(tx: Transaction): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE transactions
       SET title = ?, amount = ?, type = ?, category_id = ?, date = ?, time = ?,
           note = ?, payment_method = ?
     WHERE id = ?`,
    tx.title,
    tx.amount,
    tx.type,
    tx.categoryId,
    tx.date,
    tx.time ?? '',
    tx.note ?? null,
    tx.paymentMethod ?? null,
    tx.id
  );
}

export async function deleteTransactionRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
}

export async function clearAllTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  await db.runAsync('DELETE FROM transactions');
  return [];
}

/* --------------------------------- Budgets -------------------------------- */

export async function loadBudgets(): Promise<Budget[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<BudgetRow>('SELECT * FROM budgets');
  return rows.map((r) => ({ categoryId: r.category_id, monthlyLimit: r.monthly_limit }));
}

export async function upsertBudget(categoryId: string, monthlyLimit: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO budgets (category_id, monthly_limit) VALUES (?, ?)
     ON CONFLICT(category_id) DO UPDATE SET monthly_limit = excluded.monthly_limit`,
    categoryId,
    monthlyLimit
  );
}

/* ---------------------------------- Demo ---------------------------------- */

export async function resetStorageToDemo(): Promise<{ transactions: Transaction[]; budgets: Budget[] }> {
  const db = await getDb();
  const transactions = generateDemoTransactions();
  const budgets = DEFAULT_BUDGETS;
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync('DELETE FROM transactions');
    await txn.runAsync('DELETE FROM budgets');
    for (const tx of transactions) {
      await insertTransactionRow(txn, tx);
    }
    for (const b of budgets) {
      await txn.runAsync(
        'INSERT INTO budgets (category_id, monthly_limit) VALUES (?, ?)',
        b.categoryId,
        b.monthlyLimit
      );
    }
  });
  return { transactions, budgets };
}
