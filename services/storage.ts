import * as SQLite from 'expo-sqlite';
import { Transaction, TransactionType } from '@/types/finance';
import { generateDemoTransactions } from './storageShared';

export { generateDemoTransactions } from './storageShared';

/**
 * Native storage (Android / iOS) backed by SQLite.
 * The database file lives on the device, so the app works fully offline.
 * Web uses `storage.web.ts` (AsyncStorage) with the same exported API.
 */

const DATABASE_NAME = 'finance-track.db';
const DATABASE_VERSION = 2;

type TransactionRow = {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
  time: string;
  note: string | null;
  created_at: number;
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

  // Rebuild `transactions` with the current schema (dropped category_id,
  // payment_method and the whole budgets table). Existing rows are preserved.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions_new (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL
    );
  `);

  if (currentVersion === 1) {
    await db.execAsync(`
      INSERT INTO transactions_new (id, title, amount, type, date, time, note, created_at)
      SELECT id, title, amount, type, date, time, note, created_at FROM transactions;
    `);
  }

  await db.execAsync(`
    DROP TABLE IF EXISTS transactions;
    ALTER TABLE transactions_new RENAME TO transactions;
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date);
    DROP TABLE IF EXISTS budgets;
  `);

  currentVersion = DATABASE_VERSION;
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    title: row.title,
    amount: row.amount,
    type: row.type as TransactionType,
    date: row.date,
    time: row.time,
    note: row.note ?? undefined,
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
      (id, title, amount, type, date, time, note, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    tx.id,
    tx.title,
    tx.amount,
    tx.type,
    tx.date,
    tx.time ?? '',
    tx.note ?? null,
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
       SET title = ?, amount = ?, type = ?, date = ?, time = ?, note = ?
     WHERE id = ?`,
    tx.title,
    tx.amount,
    tx.type,
    tx.date,
    tx.time ?? '',
    tx.note ?? null,
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

/* ---------------------------------- Demo ---------------------------------- */

export async function resetStorageToDemo(): Promise<{ transactions: Transaction[] }> {
  const db = await getDb();
  const transactions = generateDemoTransactions();
  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync('DELETE FROM transactions');
    for (const tx of transactions) {
      await insertTransactionRow(txn, tx);
    }
  });
  return { transactions };
}
