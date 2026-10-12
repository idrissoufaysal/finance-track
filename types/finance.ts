export type TimeFrame = 'day' | 'week' | 'month';

export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'card' | 'cash' | 'transfer' | 'apple_pay';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO format 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  note?: string;
  paymentMethod?: PaymentMethod;
  createdAt: number;
}

export interface Budget {
  categoryId: string;
  monthlyLimit: number;
}

export interface PeriodSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
}

export interface CategorySummary {
  category: Category;
  totalAmount: number;
  count: number;
  percentage: number;
}

export interface DailyPoint {
  dayLabel: string; // 'Lun', 'Mar', etc.
  dateString: string; // 'YYYY-MM-DD'
  income: number;
  expense: number;
  isToday: boolean;
  isSelected: boolean;
}
