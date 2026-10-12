import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget } from '@/types/finance';
import { toISODate } from '@/utils/dateUtils';

const STORAGE_KEY_TRANSACTIONS = '@finance_track_transactions_v1';
const STORAGE_KEY_BUDGETS = '@finance_track_budgets_v1';

// In-memory fallback in case native AsyncStorage has issues
let memoryTransactions: Transaction[] | null = null;
let memoryBudgets: Budget[] | null = null;

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

  // --- AUJOURD'HUI (Day tracking) ---
  addTx(0, '08:45', 'Café & Croissant', 3.80, 'expense', 'food', 'apple_pay', 'Boulangerie du coin');
  addTx(0, '12:30', 'Déjeuner brasserie', 18.50, 'expense', 'food', 'card', 'Menu du midi');
  addTx(0, '15:10', 'Recharge Navigo / Transport', 25.00, 'expense', 'transport', 'apple_pay');

  // --- HIER ---
  addTx(1, '19:40', 'Courses hebdomadaires', 74.30, 'expense', 'food', 'card', 'Monoprix alimentation');
  addTx(1, '14:15', 'Pharmacie & Vitamines', 16.20, 'expense', 'health', 'card');

  // --- IL Y A 2 JOURS ---
  addTx(2, '18:20', 'Place de cinéma + Popcorn', 15.50, 'expense', 'entertainment', 'card', 'Film du soir');
  addTx(2, '10:00', 'Virement Client Freelance', 480.00, 'income', 'freelance', 'transfer', 'Mission UI design');

  // --- IL Y A 3 JOURS ---
  addTx(3, '20:15', 'Dîner restaurant italien', 45.00, 'expense', 'food', 'card', 'Pâtes fraîches');
  addTx(3, '09:00', 'Abonnement Salle de sport', 39.99, 'expense', 'health', 'card');

  // --- IL Y A 4 JOURS ---
  addTx(4, '16:00', 'Boutique vêtements', 59.90, 'expense', 'shopping', 'card', 'Pull d\'automne');
  addTx(4, '11:30', 'Course VTC Uber', 18.20, 'expense', 'transport', 'apple_pay');

  // --- IL Y A 5 JOURS ---
  addTx(5, '13:00', 'Sandwich & Boisson', 9.50, 'expense', 'food', 'card');
  addTx(5, '17:30', 'Abonnement Netflix & Spotify', 29.98, 'expense', 'bills', 'card');

  // --- DÉBUT DU MOIS (Month tracking) ---
  addTx(8, '07:30', 'Virement Salaire Net', 2950.00, 'income', 'salary', 'transfer', 'Entreprise Tech');
  addTx(8, '10:00', 'Loyer appartement & charges', 890.00, 'expense', 'housing', 'transfer', 'Prélèvement automatique');
  addTx(9, '14:00', 'Facture Électricité & Gaz', 72.50, 'expense', 'housing', 'transfer');
  addTx(10, '11:00', 'Facture Box Internet & Forfait', 39.99, 'expense', 'bills', 'card');
  addTx(12, '15:45', 'Vente LeBonCoin', 65.00, 'income', 'sale', 'cash', 'Ancien écran PC');
  addTx(14, '18:00', 'Grandes courses marché', 62.40, 'expense', 'food', 'card');

  return txs;
}

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

export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    if (!raw) {
      const demo = memoryTransactions || generateDemoTransactions();
      memoryTransactions = demo;
      try {
        await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(demo));
      } catch {}
      return demo;
    }
    const parsed = JSON.parse(raw);
    memoryTransactions = parsed;
    return parsed;
  } catch (error) {
    console.warn('AsyncStorage fallback for transactions:', error);
    if (!memoryTransactions) {
      memoryTransactions = generateDemoTransactions();
    }
    return memoryTransactions;
  }
}

export async function saveTransactions(transactions: Transaction[]): Promise<void> {
  memoryTransactions = transactions;
  try {
    await AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.warn('AsyncStorage save fallback:', error);
  }
}

export async function loadBudgets(): Promise<Budget[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_BUDGETS);
    if (!raw) {
      const demo = memoryBudgets || DEFAULT_BUDGETS;
      memoryBudgets = demo;
      try {
        await AsyncStorage.setItem(STORAGE_KEY_BUDGETS, JSON.stringify(demo));
      } catch {}
      return demo;
    }
    const parsed = JSON.parse(raw);
    memoryBudgets = parsed;
    return parsed;
  } catch (error) {
    console.warn('AsyncStorage fallback for budgets:', error);
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
    console.warn('AsyncStorage save fallback for budgets:', error);
  }
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
