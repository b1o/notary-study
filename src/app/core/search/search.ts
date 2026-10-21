import type { Language } from '../i18n/language';
import { foldText } from '../text/fold';
import { hasStem, stemText, stemWord, WORD } from './word-forms';

/** A text that the search compares, for example an article in Bulgarian, or its translation. */
export interface SearchText {
  /** The text that a snippet quotes, and the same text after foldText. */
  readonly text: string;
  readonly folded: string;
  /** The folded title. Its words count as words of the text, and a title with the query ranks first. */
  readonly title: string;
  /** The stems of the words of the title and the text (see stemText). */
  readonly stems: string;
  readonly language: Language;
}

export function searchText(language: Language, text: string, title = ''): SearchText {
  const folded = foldText(text);
  const foldedTitle = foldText(title);
  return {
    text,
    folded,
    title: foldedTitle,
    stems: stemText(`${foldedTitle} ${folded}`),
    language,
  };
}

/** Something that the search can find: one or more texts. */
export interface Searchable {
  readonly texts: readonly SearchText[];
}

/** A short part of a text around the match, which is marked. */
export interface Snippet {
  readonly before: string;
  readonly match: string;
  readonly after: string;
  readonly language: Language;
}

export interface Match<T> {
  readonly item: T;
  readonly snippet: Snippet;
}

export interface MatchList<T> {
  /** The best matches, at most the limit of the search. */
  readonly matches: readonly Match<T>[];
  /** The number of all matches. */
  readonly total: number;
}

/** A word of a query, and its stem, which also finds the other forms of the word. */
export interface QueryWord {
  readonly word: string;
  readonly stem: string;
}

/** The words of a query that count: two letters or more, folded. A one-letter query is one word. */
export function queryWords(query: string): string[] {
  const folded = foldText(query.trim());
  const words = folded.split(/\s+/).filter((word) => word.length > 1);
  return words.length || !folded ? words : [folded];
}

/** The words of a query with their stems. A word with a hyphen or a dot is its own stem. */
export function queryTerms(query: string): QueryWord[] {
  return queryWords(query).map((word) => ({
    word,
    stem: word.match(WORD)?.[0] === word ? stemWord(word) : word,
  }));
}

/**
 * How well a text has one word of the query: 3 for the word itself at the start of a word,
 * 2 for another form of it (the same stem), 1 for its letters inside a longer word, else 0.
 * A word with a digit counts only as a whole word: "28" is not in "128", "280" or "28а".
 */
function wordScore(text: SearchText, { word, stem }: QueryWord): number {
  if (/\d/.test(word)) {
    return occurs(text.folded, word, true) || occurs(text.title, word, true) ? 3 : 0;
  }
  if (occurs(text.folded, word, false) || occurs(text.title, word, false)) return 3;
  if (hasStem(text.stems, stem)) return 2;
  return text.folded.includes(word) || text.title.includes(word) ? 1 : 0;
}

/** True when `word` occurs in `text` at the start of a word, and with `whole`, also at its end. */
function occurs(text: string, word: string, whole: boolean): boolean {
  for (let at = text.indexOf(word); at >= 0; at = text.indexOf(word, at + 1)) {
    const end = at + word.length;
    const starts = at === 0 || !LETTER_OR_DIGIT.test(text[at - 1]);
    if (starts && (!whole || end === text.length || !LETTER_OR_DIGIT.test(text[end]))) return true;
  }
  return false;
}

const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;

/**
 * How a text ranks: the score of each word of the query (the text must have every word), two
 * more for the whole query of two or more words, two more again when the title has the query, and
 * one more when the title starts with it (the term "пълномощно" before "оттегляне на пълномощно").
 * A query of one word gets no points for the whole query: they would only repeat its own score.
 */
function score(text: SearchText, terms: readonly QueryWord[], phrase: string): number {
  let rank = 0;
  for (const term of terms) {
    const points = wordScore(text, term);
    if (!points) return 0;
    rank += points;
  }
  const inTitle = text.title.includes(phrase);
  const inText = terms.length > 1 && text.folded.includes(phrase);
  const titleStarts = text.title.startsWith(phrase);
  return rank + (inTitle || inText ? 2 : 0) + (inTitle ? 2 : 0) + (titleStarts ? 1 : 0);
}

/** The text of an item with the best rank, if the item matches. */
function bestText(
  item: Searchable,
  terms: readonly QueryWord[],
  phrase: string,
): { text: SearchText; rank: number } | undefined {
  let best: { text: SearchText; rank: number } | undefined;
  for (const text of item.texts) {
    const rank = score(text, terms, phrase);
    if (rank > (best?.rank ?? 0)) {
      best = { text, rank };
    }
  }
  return best;
}

const phraseOf = (query: string) => foldText(query.trim()).replace(/\s+/g, ' ');

/**
 * The items with a text that has every word of the query (in any form), best first. Items with
 * the same rank keep their order (chapter order, act order).
 */
export function findMatches<T extends Searchable>(
  items: readonly T[],
  query: string,
  limit: number,
): MatchList<T> {
  const terms = queryTerms(query);
  const phrase = phraseOf(query);
  if (!terms.length) {
    return { matches: [], total: 0 };
  }
  const ranked: { item: T; text: SearchText; rank: number }[] = [];
  for (const item of items) {
    const best = bestText(item, terms, phrase);
    if (best) {
      ranked.push({ item, ...best });
    }
  }
  ranked.sort((a, b) => b.rank - a.rank);
  return {
    matches: ranked.slice(0, limit).map(({ item, text }) => ({
      item,
      snippet: snippet(text, terms, phrase),
    })),
    total: ranked.length,
  };
}

/**
 * The items that have every word of the query (in any form), in their own order: the filter of
 * a list, such as the glossary. An empty query keeps every item.
 */
export function filterItems<T extends Searchable>(items: readonly T[], query: string): T[] {
  const terms = queryTerms(query);
  if (!terms.length) return [...items];
  const phrase = phraseOf(query);
  return items.filter((item) => bestText(item, terms, phrase));
}

const BEFORE = 70;
const AFTER = 110;

/**
 * The part of the text around the whole query, or else around the first word of the query that
 * it contains, or else around the first other form of a word. The cut falls between words.
 */
export function snippet(text: SearchText, terms: readonly QueryWord[], phrase: string): Snippet {
  const { language } = text;
  // foldText keeps the length of the course and law texts (they have no combining marks), so a
  // position in the folded text is a position in the text. Otherwise show the start of the text.
  const found =
    text.folded.length === text.text.length ? matchPosition(text.folded, terms, phrase) : undefined;
  if (!found) {
    const end = cutAfter(text.text, 0, BEFORE + AFTER);
    return {
      before: text.text.slice(0, end) + ellipsis(end < text.text.length),
      match: '',
      after: '',
      language,
    };
  }
  const matchEnd = found.at + found.length;
  const start = cutBefore(text.text, found.at, BEFORE);
  const end = cutAfter(text.text, matchEnd, AFTER);
  return {
    before: ellipsis(start > 0) + text.text.slice(start, found.at),
    match: text.text.slice(found.at, matchEnd),
    after: text.text.slice(matchEnd, end) + ellipsis(end < text.text.length),
    language,
  };
}

/**
 * Where the snippet marks: the phrase, else a long word of the query, else another form of a
 * long word. A short word ("of", "на") is marked only when the query has no long word: it says
 * little about the text, so the start of the text is better.
 */
function matchPosition(
  folded: string,
  terms: readonly QueryWord[],
  phrase: string,
): { at: number; length: number } | undefined {
  const long = terms.filter((term) => term.word.length >= LONG_WORD);
  const short = terms.filter((term) => term.word.length < LONG_WORD);
  return (
    firstOf(folded, [phrase, ...long.map((term) => term.word)]) ??
    firstForm(folded, long) ??
    (long.length
      ? undefined
      : firstOf(
          folded,
          short.map((term) => term.word),
        ))
  );
}

/** From four letters a word of the query says enough about the text to mark it. */
const LONG_WORD = 4;

function firstOf(
  folded: string,
  needles: readonly string[],
): { at: number; length: number } | undefined {
  const needle = needles.find((candidate) => folded.includes(candidate));
  return needle ? { at: folded.indexOf(needle), length: needle.length } : undefined;
}

/** The first word of the text with the stem of a word of the query. */
function firstForm(
  folded: string,
  terms: readonly QueryWord[],
): { at: number; length: number } | undefined {
  for (const word of folded.matchAll(WORD)) {
    const stems = ` ${stemWord(word[0])} `;
    if (terms.some((term) => hasStem(stems, term.stem))) {
      return { at: word.index, length: word[0].length };
    }
  }
  return undefined;
}

const ellipsis = (cut: boolean) => (cut ? '…' : '');

/** A start at most `width` characters before `at`, after a space. */
function cutBefore(text: string, at: number, width: number): number {
  if (at <= width) {
    return 0;
  }
  const space = text.indexOf(' ', at - width);
  return space >= 0 && space < at ? space + 1 : at - width;
}

/** An end at most `width` characters after `from`, before a space. */
function cutAfter(text: string, from: number, width: number): number {
  if (text.length <= from + width) {
    return text.length;
  }
  const space = text.lastIndexOf(' ', from + width);
  return space > from ? space : from + width;
}
