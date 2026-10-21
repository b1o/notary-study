/*
 * The dates of an act. lex.bg gives them as Bulgarian notes ("В сила от 07.01.1997 г.",
 * "изм. ДВ. бр.84 от 6 Октомври 2023г."); these functions read the date and the issue of the
 * State Gazette (Държавен вестник) out of them, so that a page can write them in its language.
 */

/** An issue of the State Gazette. */
export interface GazetteIssue {
  /** "published" for the issue that promulgated the act, "changed" for an amendment. */
  readonly kind: 'published' | 'changed';
  readonly number: string;
  /** ISO date: "2023-10-06". */
  readonly date: string;
}

const MONTHS = [
  'януари',
  'февруари',
  'март',
  'април',
  'май',
  'юни',
  'юли',
  'август',
  'септември',
  'октомври',
  'ноември',
  'декември',
];

/** "07.01.1997" or "6 Октомври 2023": a day, a month and a year. */
const DATE = /(\d{1,2})(?:\.(\d{1,2})\.|\s+([а-я]+)\s+)(\d{4})/;

/** The date of the first DATE in a text, as an ISO date. */
function isoDate(text: string): string | undefined {
  const match = DATE.exec(text.toLowerCase());
  if (!match) return undefined;
  const [, day, monthNumber, monthName, year] = match;
  const month = monthNumber ? Number(monthNumber) : MONTHS.indexOf(monthName) + 1;
  if (!month || month > 12) return undefined;
  return `${year}-${String(month).padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * The day the act came into force: "В сила от 07.01.1997 г." or a bare "15.08.1998 г.". Other
 * notes in this place of lex.bg ("Издадена от министъра на правосъдието") give no such day.
 */
export function inForceDate(note: string | undefined): string | undefined {
  const text = note?.trim() ?? '';
  return /^(?:в сила от\s*)?\d{1,2}\.\d{1,2}\.\d{4}\s*г\.?$/i.test(text)
    ? isoDate(text)
    : undefined;
}

/** The issue of the State Gazette in a note: "изм. и доп. ДВ. бр.92 от 6 Октомври 2026г.". */
export function gazetteIssue(note: string | undefined): GazetteIssue | undefined {
  const match = /^(обн|попр|изм|доп).*?дв[.,]?\s*бр\.\s*(\d+)\s+от\s+(.+)$/i.exec(
    note?.trim() ?? '',
  );
  const date = match && isoDate(match[3]);
  if (!match || !date) return undefined;
  const kind = /^обн/i.test(match[1]) ? 'published' : 'changed';
  return { kind, number: match[2], date };
}
