import { Transaction } from '@/types/finance';
import { toISODate } from '@/utils/dateUtils';

/** AsyncStorage key flagging that the first-run onboarding was completed. */
export const ONBOARDING_STORAGE_KEY = '@finance_track_onboarding_v1';

/**
 * Jeu de données de démonstration réaliste en FCFA
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
    note?: string
  ) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysOffset);
    txs.push({
      id: `seed_${daysOffset}_${time.replace(':', '')}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      amount,
      type,
      date: toISODate(d),
      time,
      note,
      createdAt: d.getTime(),
    });
  };

  addTx(0, '08:45', 'Café & Croissant', 2500, 'expense');
  addTx(0, '12:30', 'Déjeuner restaurant', 8500, 'expense');
  addTx(1, '19:40', 'Courses supermarché', 34500, 'expense');
  addTx(2, '10:00', 'Virement Freelance', 250000, 'income');
  addTx(8, '07:30', 'Salaire mensuel', 750000, 'income');
  addTx(8, '10:00', 'Loyer appartement', 180000, 'expense');

  return txs;
}
