/**
 * How much a blank of a document template must hold, in typed characters. A blank holds what goes
 * in it: "[три имена]" holds three long names, "ЕГН [...]" ten digits. The hint in the blank says
 * what goes in it; for an empty blank "[...]" the text around it says it ("ЕГН", "евро", "от … г.").
 * The sizes and their sources are in docs/research/templates/decisions.md.
 */

/** One rule: when it matches, the blank holds `size` characters. */
interface SizeRule {
  readonly size: number;
  readonly test: RegExp;
}

/** The size of a blank that no rule knows. */
export const DEFAULT_BLANK_SIZE = 14;

/** Rules for the hint in the blank, lower case, in order: the first match wins. */
const HINT_RULES: readonly SizeRule[] = [
  { size: 33, test: /собственоръчно/ },
  { size: 75, test: /словом и цифром/ },
  { size: 50, test: /словом/ },
  { size: 14, test: /цифром|^сума/ },
  { size: 26, test: /нотариус/ },
  { size: 36, test: /имена|^име($|\s)|прехвърлител|завещател|връчител/ },
  { size: 10, test: /^дата/ },
  { size: 4, test: /^година/ },
  { size: 5, test: /^час/ },
  { size: 16, test: /^(град|държава)/ },
  { size: 26, test: /^(банка|фирма)/ },
  { size: 160, test: /описание/ },
  { size: 60, test: /документ/ },
  { size: 4, test: /^брой/ },
  { size: 6, test: /^дроб/ },
];

/** Rules for an empty blank, by the text before it (lower case, the end of the text). */
const BEFORE_RULES: readonly SizeRule[] = [
  { size: 10, test: /егн\s*$/ },
  { size: 13, test: /еик\s*$/ },
  { size: 9, test: /(л\.к\.|лична карта|паспорт|част i)\s*№\s*$/ },
  { size: 27, test: /iban\s*$/ },
  { size: 22, test: /идентификатор\s*$/ },
  { size: 17, test: /vin\)\s*№\s*$/ },
  { size: 14, test: /двигател\s*№\s*$/ },
  { size: 16, test: /(марка|модел|цвят)\s*$/ },
  { size: 4, test: /(ул\.\s*\[[^\]]*\]\s*№|ет\.|ап\.|вх\.|бл\.)\s*$/ },
  { size: 28, test: /ул\.\s*$/ },
  { size: 10, test: /(рег\.|кв\.|сметка)\s*№\s*$/ },
  { size: 6, test: /(том|№|стр\.)\s*$/ },
  { size: 10, test: /дата[^,[\]]*$/ },
  { size: 56, test: /адрес(\s+на управление|\s+за връчване)?\s*$/ },
  { size: 26, test: /(нотариус|съдия по вписванията:)\s*$/ },
  { size: 36, test: /уважаеми\/а\s*$/ },
  { size: 16, test: /(гр\.|община)\s*$/ },
  { size: 9, test: /площ\s*$/ },
];

/** Rules for an empty blank, by the text after it (lower case, the start of the text). */
const AFTER_RULES: readonly SizeRule[] = [
  { size: 14, test: /^\s*(евро|лв\.)/ },
  { size: 7, test: /^\s*%/ },
  { size: 9, test: /^\s*(\(словом\)\s*)?кв\.\s*м/ },
  { size: 6, test: /^\s*дяла/ },
];

/**
 * The number of characters that a blank must hold.
 *
 * @param before the text of the line before the blank, with other blanks in brackets
 * @param hint the text in the blank ("три имена"), or "..." for an empty blank
 * @param after the text of the line after the blank
 */
export function blankSize(before: string, hint: string, after: string): number {
  const text = hint.trim().toLocaleLowerCase('bg');
  if (!isEmptyHint(text)) {
    // The choices of "[майка/баща]" are the text; a description "[описание на имота / …]" is not.
    return match(HINT_RULES, text) ?? (isChoice(text) ? 0 : DEFAULT_BLANK_SIZE);
  }
  const head = before.toLocaleLowerCase('bg');
  const tail = after.toLocaleLowerCase('bg');
  // "от [...] г." is a date; "дело № [...]/[...] г." ends with a year.
  if (/^\s*г\./.test(tail)) return /\/\s*$/.test(head) ? 4 : 10;
  return match(BEFORE_RULES, head) ?? match(AFTER_RULES, tail) ?? DEFAULT_BLANK_SIZE;
}

/** A blank without a hint: "[...]", "[.....]", "[…]". */
export function isEmptyHint(hint: string): boolean {
  return /^[.…\s]*$/.test(hint);
}

/** A blank that offers choices, such as "[майка/баща]": it holds one of them, as written. */
function isChoice(hint: string): boolean {
  return hint.includes('/');
}

function match(rules: readonly SizeRule[], text: string): number | undefined {
  return rules.find((rule) => rule.test.test(text))?.size;
}
