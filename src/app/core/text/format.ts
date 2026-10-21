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

/** A date with the name of the month: "6 октомври 2023 г." or "6 October 2023". */
export function formatLongDate(iso: string, language: Language): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(LOCALES[language], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** A number as the reader's language writes it: "0,6" or "0.6". */
export function formatNumber(value: number, language: Language): string {
  return value.toLocaleString(LOCALES[language]);
}

/** The site of an address without "www.": "registryagency.bg". Other text stays as it is. */
export function hostOf(address: string): string {
  try {
    return new URL(address).hostname.replace(/^www\./, '');
  } catch {
    return address;
  }
}

/** An amount with two decimals and its currency: "1 234,50 €" or "1,234.50 лв.". */
export function formatMoney(amount: number, currency: 'EUR' | 'BGN', language: Language): string {
  const number = amount.toLocaleString(LOCALES[language], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // A no-break space keeps the currency on the line of its amount.
  return currency === 'BGN' ? `${number}\u00a0лв.` : `${number}\u00a0€`;
}
