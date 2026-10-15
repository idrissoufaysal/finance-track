export type TimeFrame = 'day' | 'week' | 'month' | 'year';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO format 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  note?: string;
  createdAt: number;
}

export interface PeriodSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
}

export interface DailyPoint {
  dayLabel: string; // 'Lun', 'Mar', etc.
  dateString: string; // 'YYYY-MM-DD'
  income: number;
  expense: number;
  isToday: boolean;
  isSelected: boolean;
}
