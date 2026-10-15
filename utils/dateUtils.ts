import { TimeFrame } from '@/types/finance';

/**
 * Formats a Date object to 'YYYY-MM-DD'
 */
export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses 'YYYY-MM-DD' into a Date object (at midnight local time)
 */
export function parseISODate(dateStr: string): Date {
  const parts = dateStr.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

/**
 * Returns start of day (00:00:00.000)
 */
export function startOfDay(d: Date): Date {
  const res = new Date(d);
  res.setHours(0, 0, 0, 0);
  return res;
}

/**
 * Returns end of day (23:59:59.999)
 */
export function endOfDay(d: Date): Date {
  const res = new Date(d);
  res.setHours(23, 59, 59, 999);
  return res;
}

/**
 * Returns the Monday of the current week (ISO 8601 standard week start)
 */
export function startOfWeek(d: Date): Date {
  const res = new Date(d);
  const day = res.getDay();
  // In JS, 0 is Sunday, 1 is Monday ... 6 is Saturday
  const diff = res.getDate() - (day === 0 ? 6 : day - 1);
  res.setDate(diff);
  res.setHours(0, 0, 0, 0);
  return res;
}

/**
 * Returns the Sunday of the current week
 */
export function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Returns 1st day of month (00:00:00.000)
 */
export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

/**
 * Returns last day of month (23:59:59.999)
 */
export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Checks if a target date string 'YYYY-MM-DD' falls within a period
 */
export function isDateInPeriod(targetDateStr: string, timeFrame: TimeFrame, anchorDate: Date): boolean {
  const target = parseISODate(targetDateStr);
  const targetTime = target.getTime();

  if (timeFrame === 'day') {
    const s = startOfDay(anchorDate).getTime();
    const e = endOfDay(anchorDate).getTime();
    return targetTime >= s && targetTime <= e;
  }

  if (timeFrame === 'week') {
    const s = startOfWeek(anchorDate).getTime();
    const e = endOfWeek(anchorDate).getTime();
    return targetTime >= s && targetTime <= e;
  }

  if (timeFrame === 'month') {
    const s = startOfMonth(anchorDate).getTime();
    const e = endOfMonth(anchorDate).getTime();
    return targetTime >= s && targetTime <= e;
  }

  if (timeFrame === 'year') {
    const s = new Date(anchorDate.getFullYear(), 0, 1, 0, 0, 0, 0).getTime();
    const e = new Date(anchorDate.getFullYear(), 11, 31, 23, 59, 59, 999).getTime();
    return targetTime >= s && targetTime <= e;
  }

  return false;
}

/**
 * Get readable label for the current period (French)
 */
export function getPeriodTitle(timeFrame: TimeFrame, anchorDate: Date): string {
  const now = new Date();
  const isCurrentYear = anchorDate.getFullYear() === now.getFullYear();

  if (timeFrame === 'day') {
    const isToday = toISODate(anchorDate) === toISODate(now);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = toISODate(anchorDate) === toISODate(yesterday);
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = toISODate(anchorDate) === toISODate(tomorrow);

    const formatted = anchorDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: isCurrentYear ? undefined : 'numeric',
    });
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    if (isToday) return `Aujourd'hui, ${anchorDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
    if (isYesterday) return `Hier, ${anchorDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
    if (isTomorrow) return `Demain, ${anchorDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
    return capitalized;
  }

  if (timeFrame === 'week') {
    const start = startOfWeek(anchorDate);
    const end = endOfWeek(anchorDate);
    const isCurrentWeek =
      toISODate(startOfWeek(now)) === toISODate(start);

    const sDay = start.getDate();
    const sMonth = start.toLocaleDateString('fr-FR', { month: 'short' });
    const eDay = end.getDate();
    const eMonth = end.toLocaleDateString('fr-FR', { month: 'short' });

    const rangeStr = sMonth === eMonth 
      ? `${sDay} - ${eDay} ${eMonth}` 
      : `${sDay} ${sMonth} - ${eDay} ${eMonth}`;

    if (isCurrentWeek) {
      return `Cette semaine (${rangeStr})`;
    }
    return `Semaine du ${rangeStr}`;
  }

  if (timeFrame === 'month') {
    const isCurrentMonth =
      anchorDate.getMonth() === now.getMonth() && anchorDate.getFullYear() === now.getFullYear();
    const formatted = anchorDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    if (isCurrentMonth) {
      return `Ce mois-ci (${capitalized})`;
    }
    return capitalized;
  }

  if (timeFrame === 'year') {
    const isCurrentYear = anchorDate.getFullYear() === now.getFullYear();
    if (isCurrentYear) {
      return `Cette année (${anchorDate.getFullYear()})`;
    }
    return `Année ${anchorDate.getFullYear()}`;
  }

  return '';
}

/**
 * Checks if the anchor date is the current period
 */
export function isCurrentPeriod(timeFrame: TimeFrame, anchorDate: Date): boolean {
  const now = new Date();
  if (timeFrame === 'day') {
    return toISODate(anchorDate) === toISODate(now);
  }
  if (timeFrame === 'week') {
    return toISODate(startOfWeek(anchorDate)) === toISODate(startOfWeek(now));
  }
  if (timeFrame === 'month') {
    return anchorDate.getMonth() === now.getMonth() && anchorDate.getFullYear() === now.getFullYear();
  }
  if (timeFrame === 'year') {
    return anchorDate.getFullYear() === now.getFullYear();
  }
  return false;
}

/**
 * Shift date forward or backward based on timeframe
 */
export function shiftDate(date: Date, timeFrame: TimeFrame, direction: 1 | -1): Date {
  const res = new Date(date);
  if (timeFrame === 'day') {
    res.setDate(res.getDate() + direction);
  } else if (timeFrame === 'week') {
    res.setDate(res.getDate() + direction * 7);
  } else if (timeFrame === 'month') {
    res.setMonth(res.getMonth() + direction);
  } else if (timeFrame === 'year') {
    res.setFullYear(res.getFullYear() + direction);
  }
  return res;
}

export const CURRENCY_LABEL = 'FCFA';

/**
 * Group digits with spaces (French style), no decimals: 1250000 -> "1 250 000".
 * Implemented manually so the output is identical on Hermes, iOS, Android and web.
 */
export function formatAmount(amount: number): string {
  const rounded = Math.round(Math.abs(amount));
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Format currency in FCFA (XOF/XAF, no decimals): -1500 -> "-1 500 FCFA"
 */
export function formatCurrency(amount: number): string {
  const sign = Math.round(amount) < 0 ? '-' : '';
  return `${sign}${formatAmount(amount)} ${CURRENCY_LABEL}`;
}

/**
 * Compact format for tight spaces (chart labels): 1500 -> "1,5k", 2500000 -> "2,5M"
 */
export function formatCompact(amount: number): string {
  const abs = Math.abs(amount);
  const fmt = (n: number) => (Math.round(n * 10) / 10).toString().replace('.', ',');
  if (abs >= 1_000_000) return `${fmt(abs / 1_000_000)}M`;
  if (abs >= 1_000) return `${fmt(abs / 1_000)}k`;
  return `${Math.round(abs)}`;
}
