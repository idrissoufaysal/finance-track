import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  Budget,
  TimeFrame,
  PeriodSummary,
  CategorySummary,
  DailyPoint,
} from '@/types/finance';
import {
  loadTransactions,
  insertTransaction,
  updateTransactionRecord,
  deleteTransactionRecord,
  loadBudgets,
  upsertBudget,
  clearAllTransactions,
  resetStorageToDemo,
  DEFAULT_BUDGETS,
} from '@/services/storage';
import {
  isDateInPeriod,
  getPeriodTitle,
  isCurrentPeriod,
  shiftDate,
  startOfWeek,
  toISODate,
} from '@/utils/dateUtils';
import { getCategoryById } from '@/constants/categories';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  isLoading: boolean;
  timeFrame: TimeFrame;
  selectedDate: Date;
  setTimeFrame: (tf: TimeFrame) => void;
  setSelectedDate: (d: Date) => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToToday: () => void;
  periodTitle: string;
  isCurrent: boolean;
  
  // Computed for selected period
  filteredTransactions: Transaction[];
  periodSummary: PeriodSummary;
  categorySummaries: CategorySummary[];
  chartPoints: DailyPoint[];
  
  // Actions
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<Transaction>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateBudget: (categoryId: string, monthlyLimit: number) => Promise<void>;
  clearAllData: () => Promise<void>;
  resetToDemo: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load initial data (starts with 0 transactions)
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [loadedTxs, loadedBudgets] = await Promise.all([
          loadTransactions(),
          loadBudgets(),
        ]);
        setTransactions(loadedTxs);
        setBudgets(loadedBudgets);
      } catch (e) {
        console.error('Failed to init finance context:', e);
        setTransactions([]);
        setBudgets(DEFAULT_BUDGETS);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Navigation helpers
  const goToPrevious = useCallback(() => {
    setSelectedDate((prev) => shiftDate(prev, timeFrame, -1));
  }, [timeFrame]);

  const goToNext = useCallback(() => {
    setSelectedDate((prev) => shiftDate(prev, timeFrame, 1));
  }, [timeFrame]);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const periodTitle = useMemo(() => {
    return getPeriodTitle(timeFrame, selectedDate);
  }, [timeFrame, selectedDate]);

  const isCurrent = useMemo(() => {
    return isCurrentPeriod(timeFrame, selectedDate);
  }, [timeFrame, selectedDate]);

  // Filtered transactions for the selected timeframe and anchor date
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => isDateInPeriod(tx.date, timeFrame, selectedDate))
      .sort((a, b) => {
        if (a.date !== b.date) {
          return b.date.localeCompare(a.date);
        }
        return (b.time || '').localeCompare(a.time || '');
      });
  }, [transactions, timeFrame, selectedDate]);

  // Period summary: total income, expense, balance, savings rate
  const periodSummary = useMemo<PeriodSummary>(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of filteredTransactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }
    }

    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.max(0, (netBalance / totalIncome) * 100) : 0;

    return {
      totalIncome,
      totalExpense,
      netBalance,
      savingsRate,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Category breakdown for expenses in this period
  const categorySummaries = useMemo<CategorySummary[]>(() => {
    const map = new Map<string, { total: number; count: number }>();

    for (const tx of filteredTransactions) {
      if (tx.type === 'expense') {
        const cur = map.get(tx.categoryId) || { total: 0, count: 0 };
        map.set(tx.categoryId, {
          total: cur.total + tx.amount,
          count: cur.count + 1,
        });
      }
    }

    const totalExpense = periodSummary.totalExpense;
    const result: CategorySummary[] = [];

    map.forEach((value, catId) => {
      const category = getCategoryById(catId);
      result.push({
        category,
        totalAmount: value.total,
        count: value.count,
        percentage: totalExpense > 0 ? (value.total / totalExpense) * 100 : 0,
      });
    });

    return result.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [filteredTransactions, periodSummary.totalExpense]);

  // Chart data points based on timeframe
  const chartPoints = useMemo<DailyPoint[]>(() => {
    const todayStr = toISODate(new Date());

    if (timeFrame === 'day') {
      const center = new Date(selectedDate);
      const points: DailyPoint[] = [];
      const labels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

      for (let offset = -3; offset <= 3; offset++) {
        const d = new Date(center);
        d.setDate(d.getDate() + offset);
        const dStr = toISODate(d);
        const dayTxs = transactions.filter((t) => t.date === dStr);

        let inc = 0;
        let exp = 0;
        for (const t of dayTxs) {
          if (t.type === 'income') inc += t.amount;
          else exp += t.amount;
        }

        points.push({
          dayLabel: offset === 0 ? 'Ce jour' : labels[d.getDay()],
          dateString: dStr,
          income: inc,
          expense: exp,
          isToday: dStr === todayStr,
          isSelected: offset === 0,
        });
      }
      return points;
    }

    if (timeFrame === 'week') {
      const monday = startOfWeek(selectedDate);
      const daysLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const points: DailyPoint[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = toISODate(d);
        const dayTxs = transactions.filter((t) => t.date === dStr);

        let inc = 0;
        let exp = 0;
        for (const t of dayTxs) {
          if (t.type === 'income') inc += t.amount;
          else exp += t.amount;
        }

        points.push({
          dayLabel: daysLabels[i],
          dateString: dStr,
          income: inc,
          expense: exp,
          isToday: dStr === todayStr,
          isSelected: dStr === toISODate(selectedDate),
        });
      }
      return points;
    }

    if (timeFrame === 'month') {
      const points: DailyPoint[] = [];
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();

      const chunks = [
        { label: 'Sem 1', start: 1, end: 7 },
        { label: 'Sem 2', start: 8, end: 14 },
        { label: 'Sem 3', start: 15, end: 21 },
        { label: 'Sem 4', start: 22, end: daysInMonth },
      ];

      for (const chunk of chunks) {
        let inc = 0;
        let exp = 0;
        for (let day = chunk.start; day <= chunk.end; day++) {
          const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTxs = transactions.filter((t) => t.date === dStr);
          for (const t of dayTxs) {
            if (t.type === 'income') inc += t.amount;
            else exp += t.amount;
          }
        }

        points.push({
          dayLabel: chunk.label,
          dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(chunk.start).padStart(2, '0')}`,
          income: inc,
          expense: exp,
          isToday: false,
          isSelected: false,
        });
      }
      return points;
    }

    if (timeFrame === 'year') {
      const points: DailyPoint[] = [];
      const year = selectedDate.getFullYear();
      const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

      for (let m = 0; m < 12; m++) {
        const prefix = `${year}-${String(m + 1).padStart(2, '0')}`;
        const monthTxs = transactions.filter((t) => t.date.startsWith(prefix));
        let inc = 0;
        let exp = 0;
        for (const t of monthTxs) {
          if (t.type === 'income') inc += t.amount;
          else exp += t.amount;
        }

        points.push({
          dayLabel: monthNames[m],
          dateString: `${prefix}-01`,
          income: inc,
          expense: exp,
          isToday: false,
          isSelected: false,
        });
      }
      return points;
    }

    return [];
  }, [transactions, timeFrame, selectedDate]);

  // Actions
  const addTransaction = useCallback(
    async (data: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
      const newTx: Transaction = {
        ...data,
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: Date.now(),
      };
      setTransactions((prev) => [newTx, ...prev]);
      await insertTransaction(newTx);
      return newTx;
    },
    []
  );

  const updateTransaction = useCallback(
    async (tx: Transaction): Promise<void> => {
      setTransactions((prev) => prev.map((item) => (item.id === tx.id ? tx : item)));
      await updateTransactionRecord(tx);
    },
    []
  );

  const deleteTransaction = useCallback(
    async (id: string): Promise<void> => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      await deleteTransactionRecord(id);
    },
    []
  );

  const updateBudget = useCallback(
    async (categoryId: string, monthlyLimit: number): Promise<void> => {
      setBudgets((prev) => {
        const existing = prev.find((b) => b.categoryId === categoryId);
        if (existing) {
          return prev.map((b) =>
            b.categoryId === categoryId ? { ...b, monthlyLimit } : b
          );
        }
        return [...prev, { categoryId, monthlyLimit }];
      });
      await upsertBudget(categoryId, monthlyLimit);
    },
    []
  );

  const clearAllData = useCallback(async (): Promise<void> => {
    await clearAllTransactions();
    setTransactions([]);
  }, []);

  const resetToDemo = useCallback(async (): Promise<void> => {
    const res = await resetStorageToDemo();
    setTransactions(res.transactions);
    setBudgets(res.budgets);
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        isLoading,
        timeFrame,
        selectedDate,
        setTimeFrame,
        setSelectedDate,
        goToPrevious,
        goToNext,
        goToToday,
        periodTitle,
        isCurrent,
        filteredTransactions,
        periodSummary,
        categorySummaries,
        chartPoints,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        clearAllData,
        resetToDemo,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
