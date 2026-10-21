/**
 * Text in the form that filters and search compare: lower case, without stress marks.
 * "ѝ" becomes "и"; "й" stays a letter of its own (only the grave and acute accents go).
 */
export function foldText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(STRESS_MARKS, '').normalize('NFC');
}

/** The combining grave and acute accents, which Bulgarian uses only as stress marks. */
const STRESS_MARKS = /[\u0300\u0301]/g;
