/*
 * The Tariff of notarial fees (Тарифа за нотариалните такси към ЗННД). The tariff states the
 * amounts in leva; the functions work in leva and the bill converts to euro at the fixed rate.
 * Each function names the item of the tariff ("т. 8") that it follows.
 */

/** Leva per euro, fixed since 1 January 2026 (Art. 11–13 ЗВЕРБ). */
export const LEVA_PER_EURO = 1.95583;

export const toLeva = (euro: number) => euro * LEVA_PER_EURO;
export const toEuro = (leva: number) => roundCents(leva / LEVA_PER_EURO);
export const roundCents = (amount: number) => Math.round(amount * 100) / 100;

/** Item 8: notarial deed, by the material interest. A table of brackets, at most 6000 лв. */
export function item8Fee(interest: number): number {
  const x = Math.max(0, interest);
  if (x <= 100) return 30;
  if (x <= 1_000) return 30 + 0.015 * (x - 100);
  if (x <= 10_000) return 43.5 + 0.013 * (x - 1_000);
  if (x <= 50_000) return 160.5 + 0.008 * (x - 10_000);
  if (x <= 100_000) return 480.5 + 0.005 * (x - 50_000);
  if (x <= 500_000) return 730.5 + 0.002 * (x - 100_000);
  return Math.min(6_000, 1530.5 + 0.001 * (x - 500_000));
}

/** Item 9: signatures on contracts subject to entry, wills and similar: 50% of item 8, at least 30 лв. */
export const item9Fee = (interest: number) => Math.max(30, 0.5 * item8Fee(interest));

/** Item 10: signatures on contracts with a material interest: 30% of item 8, at least 30 лв. */
export const item10Fee = (interest: number) => Math.max(30, 0.3 * item8Fee(interest));

/** Item 12: signatures on one-sided statements with a material interest: half of item 10, at least 25 лв. */
export const item12Fee = (interest: number) => Math.max(25, 0.5 * item10Fee(interest));

/**
 * Item 5: date and signatures without a material interest.
 * а) 5 лв. for the first signature, в) 2 лв. for each next one; б) re-delegation doubles the fee per signature;
 * г) 10 лв. per signature on a document for rights over real estate; д) re-delegation doubles that.
 */
export function item5Fee(signatures: number, forProperty: boolean, redelegation: boolean): number {
  const count = Math.max(1, Math.round(signatures));
  const factor = redelegation ? 2 : 1;
  return forProperty ? 10 * factor * count : 5 * factor + 2 * (count - 1);
}

/** Item 6: true copies: 3 лв. for the first page and 2 лв. for each next page, per copy. */
export function item6Fee(pages: number, copies: number): number {
  const pageCount = Math.max(1, Math.round(pages));
  const copyCount = Math.max(1, Math.round(copies));
  return copyCount * (3 + 2 * (pageCount - 1));
}

/** Entry fee of the Registry Agency (Art. 2 of its tariff): 0.1% of the material interest, at least 10 лв. */
export const entryFee = (interest: number) => Math.max(10, 0.001 * interest);
