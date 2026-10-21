import type { Language } from '../i18n/language';

const LOCALES: Readonly<Record<Language, string>> = { bg: 'bg-BG', en: 'en-GB' };

/** A date as the reader's language writes it: "21.10.2026 г." or "21 Oct 2026". */
export function formatDate(iso: string, language: Language): string {
  return new Date(iso).toLocaleDateString(LOCALES[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** An amount with two decimals and its currency: "1 234,50 €" or "1,234.50 лв.". */
export function formatMoney(amount: number, currency: 'EUR' | 'BGN', language: Language): string {
  const number = amount.toLocaleString(LOCALES[language], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency === 'BGN' ? `${number} лв.` : `${number} €`;
}
