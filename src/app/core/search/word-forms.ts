/**
 * Word forms for search. A query word finds the other forms of the same word when both have the
 * same stem: "нотариален", "нотариалния" and "нотариалната" all have the stem "нотариалн".
 *
 * Bulgarian follows the light stemmer of J. Savoy ("Searching strategies for the Bulgarian
 * language", Information Retrieval 10, 2007): it removes the definite article, the plural and
 * the gender ending, and undoes a few sound changes (-ен → -н, -ъ- that drops). English removes
 * the plural and the -ed and -ing endings. Both work on folded text (see core/text/fold.ts).
 */

const CYRILLIC = /[а-я]/;

/** A word: letters and digits. A hyphen or a dot separates words. */
export const WORD = /[\p{L}\p{N}]+/gu;

/**
 * A stem shorter than this must be a whole stem of the text. A longer one may also start one, so
 * that "договор" finds "договорна"; a short one would find too much ("акт" and "актуален").
 */
const PREFIX_FROM = 6;

/** The stem of one folded word, Bulgarian or English by its letters. Short words stay as they are. */
export function stemWord(word: string): string {
  if (CYRILLIC.test(word)) return bulgarianStem(word);
  if (/^[a-z]+$/.test(word)) return englishStem(word);
  return word;
}

/** The stems of the words of a folded text, between spaces: " stem stem stem ". */
export function stemText(folded: string): string {
  const stems = (folded.match(WORD) ?? []).map(stemWord);
  return stems.length ? ` ${stems.join(' ')} ` : '';
}

/** True when a text, by its stems (see stemText), has a word with this stem. */
export function hasStem(stems: string, stem: string): boolean {
  return stems.includes(stem.length >= PREFIX_FROM ? ` ${stem}` : ` ${stem} `);
}

function bulgarianStem(word: string): string {
  if (word.length < 4) return word;
  if (word.length > 5 && word.endsWith('ища')) return word.slice(0, -3);
  let stem = withoutPlural(withoutArticle(word));
  if (stem.length > 3) {
    if (stem.endsWith('я')) stem = stem.slice(0, -1);
    if (/[аое]$/.test(stem)) stem = stem.slice(0, -1);
  }
  // "нотариален" and "нотариални": the е of -ен drops in the other forms.
  if (stem.length > 4 && stem.endsWith('ен')) stem = `${stem.slice(0, -2)}н`;
  // "вятър" and "вятъра", "петър" and "петра": the ъ before the last letter drops.
  if (stem.length > 5 && stem.at(-2) === 'ъ') stem = stem.slice(0, -2) + stem.slice(-1);
  return stem;
}

/** Without the definite article: -ият, -ът, -ят, -то, -те, -та, -ия. */
function withoutArticle(word: string): string {
  const length = word.length;
  if (length > 6 && word.endsWith('ият')) return word.slice(0, -3);
  if (length > 5 && /(то|те|та|ия)$/.test(word)) return word.slice(0, -2);
  // From five letters, unlike Savoy, so that "актът" and "домът" lose the article too.
  if (length > 4 && /(ът|ят)$/.test(word)) return word.slice(0, -2);
  return word;
}

/** Without the plural ending, with the consonant changes of the plural undone. */
function withoutPlural(word: string): string {
  const length = word.length;
  // Savoy also turns -овци into -о ("дядовци" → "дядо"); here it would join "търговци" with "търг".
  // -ове from six letters, unlike Savoy, so that "актове" and "домове" lose it too.
  if (length > 5 && word.endsWith('ове')) return word.slice(0, -3); // "актове" → "акт"
  if (length > 6 && word.endsWith('еве')) return `${word.slice(0, -3)}й`; // "краеве" → "край"
  if (length > 5) {
    if (word.endsWith('ища')) return word.slice(0, -3);
    if (word.endsWith('та')) return word.slice(0, -2);
    if (word.endsWith('ци')) return `${word.slice(0, -2)}к`; // "ученици" → "ученик"
    if (word.endsWith('зи')) return `${word.slice(0, -2)}г`; // "залози" → "залог"
    if (word.at(-3) === 'е' && word.endsWith('и')) {
      return `${word.slice(0, -3)}я${word.at(-2)}`; // "големи" → "голям"
    }
  }
  // Savoy also turns -си into -х ("успеси" → "успех"); in legal texts that breaks far more words
  // than it joins ("нотариуси", "подписи", "адреси"), so -и only goes.
  if (length > 4 && word.endsWith('и')) return word.slice(0, -1);
  return word;
}

/** English: notaries → notar, notary → notar, deeds → deed, signed → sign, taxes → tax. */
function englishStem(word: string): string {
  if (word.length < 4) return word;
  let stem = word;
  if (/(ies|ied)$/.test(stem) && stem.length > 4) stem = stem.slice(0, -3);
  else if (stem.endsWith('ing') && stem.length > 5) stem = stem.slice(0, -3);
  else if (stem.endsWith('ed') && stem.length > 4) stem = stem.slice(0, -2);
  else if (/(s|x|z|ch|sh)es$/.test(stem) && stem.length > 4) stem = stem.slice(0, -2);
  else if (/[^sui]s$/.test(stem)) stem = stem.slice(0, -1);
  if (/[ey]$/.test(stem) && stem.length > 4) stem = stem.slice(0, -1);
  return stem;
}
