import type { Language } from '../i18n/language';
import { foldText } from '../text/fold';

/** A text that the search compares, for example an article in Bulgarian, or its translation. */
export interface SearchText {
  /** The text that a snippet quotes, and the same text after foldText. */
  readonly text: string;
  readonly folded: string;
  /** The folded title. Its words count as words of the text, and a title with the query ranks first. */
  readonly title: string;
  readonly language: Language;
}

export function searchText(language: Language, text: string, title = ''): SearchText {
  return { text, folded: foldText(text), title: foldText(title), language };
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

/** The words of a query that count: two letters or more, folded. A one-letter query is one word. */
export function queryWords(query: string): string[] {
  const folded = foldText(query.trim());
  const words = folded.split(/\s+/).filter((word) => word.length > 1);
  return words.length || !folded ? words : [folded];
}

/** How a text ranks: every word is a point, the whole query is two more, in the title two more again. */
function score(text: SearchText, words: readonly string[], phrase: string): number {
  const found = words.filter((word) => text.folded.includes(word) || text.title.includes(word));
  if (found.length < words.length) {
    return 0;
  }
  const inTitle = text.title.includes(phrase);
  return found.length + (inTitle || text.folded.includes(phrase) ? 2 : 0) + (inTitle ? 2 : 0);
}

/**
 * The items with a text that contains every word of the query, best first. Items with the same
 * rank keep their order (chapter order, act order).
 */
export function findMatches<T extends Searchable>(
  items: readonly T[],
  query: string,
  limit: number,
): MatchList<T> {
  const words = queryWords(query);
  const phrase = foldText(query.trim()).replace(/\s+/g, ' ');
  if (!words.length) {
    return { matches: [], total: 0 };
  }
  const ranked: { item: T; text: SearchText; rank: number }[] = [];
  for (const item of items) {
    let best: { text: SearchText; rank: number } | undefined;
    for (const text of item.texts) {
      const rank = score(text, words, phrase);
      if (rank > (best?.rank ?? 0)) {
        best = { text, rank };
      }
    }
    if (best) {
      ranked.push({ item, ...best });
    }
  }
  ranked.sort((a, b) => b.rank - a.rank);
  return {
    matches: ranked.slice(0, limit).map(({ item, text }) => ({
      item,
      snippet: snippet(text, words, phrase),
    })),
    total: ranked.length,
  };
}

const BEFORE = 70;
const AFTER = 110;

/**
 * The part of the text around the whole query, or else around the first word that it contains.
 * The cut falls between words.
 */
export function snippet(text: SearchText, words: readonly string[], phrase: string): Snippet {
  const { language } = text;
  const needle = [phrase, ...words].find((candidate) => text.folded.includes(candidate));
  // foldText keeps the length of the course and law texts (they have no combining marks), so a
  // position in the folded text is a position in the text. Otherwise show the start of the text.
  if (!needle || text.folded.length !== text.text.length) {
    const end = cutAfter(text.text, 0, BEFORE + AFTER);
    return {
      before: text.text.slice(0, end) + ellipsis(end < text.text.length),
      match: '',
      after: '',
      language,
    };
  }
  const at = text.folded.indexOf(needle);
  const matchEnd = at + needle.length;
  const start = cutBefore(text.text, at, BEFORE);
  const end = cutAfter(text.text, matchEnd, AFTER);
  return {
    before: ellipsis(start > 0) + text.text.slice(start, at),
    match: text.text.slice(at, matchEnd),
    after: text.text.slice(matchEnd, end) + ellipsis(end < text.text.length),
    language,
  };
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
