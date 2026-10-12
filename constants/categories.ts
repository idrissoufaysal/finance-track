import { Category } from '@/types/finance';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Alimentation & Resto', icon: 'restaurant-outline', color: '#F59E0B', type: 'expense' },
  { id: 'transport', name: 'Transports', icon: 'car-outline', color: '#3B82F6', type: 'expense' },
  { id: 'housing', name: 'Logement & Énergie', icon: 'home-outline', color: '#8B5CF6', type: 'expense' },
  { id: 'shopping', name: 'Shopping & Achats', icon: 'cart-outline', color: '#EC4899', type: 'expense' },
  { id: 'health', name: 'Santé & Bien-être', icon: 'medkit-outline', color: '#10B981', type: 'expense' },
  { id: 'entertainment', name: 'Loisirs & Sorties', icon: 'game-controller-outline', color: '#6366F1', type: 'expense' },
  { id: 'bills', name: 'Abonnements & Factures', icon: 'receipt-outline', color: '#14B8A6', type: 'expense' },
  { id: 'travel', name: 'Voyages & Vacances', icon: 'airplane-outline', color: '#F97316', type: 'expense' },
  { id: 'other_expense', name: 'Autres dépenses', icon: 'ellipsis-horizontal-circle-outline', color: '#64748B', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salaire', icon: 'briefcase-outline', color: '#10B981', type: 'income' },
  { id: 'freelance', name: 'Freelance & Missions', icon: 'laptop-outline', color: '#06B6D4', type: 'income' },
  { id: 'investment', name: 'Dividendes & Bourse', icon: 'trending-up-outline', color: '#8B5CF6', type: 'income' },
  { id: 'sale', name: 'Vente d\'objets', icon: 'pricetag-outline', color: '#F59E0B', type: 'income' },
  { id: 'gift', name: 'Cadeaux & Remboursements', icon: 'gift-outline', color: '#F43F5E', type: 'income' },
  { id: 'other_income', name: 'Autres revenus', icon: 'wallet-outline', color: '#10B981', type: 'income' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryById(id: string): Category {
  const found = ALL_CATEGORIES.find((c) => c.id === id);
  if (found) return found;
  return {
    id,
    name: 'Divers',
    icon: 'help-circle-outline',
    color: '#64748B',
    type: 'expense',
  };
}
