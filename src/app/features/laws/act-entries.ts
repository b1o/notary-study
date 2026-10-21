import { splitHeading, type HeadingParts } from '../../core/laws/law-text';
import {
  isArticle,
  type ActTranslation,
  type LawArticle,
  type LawHeading,
  type LawItem,
} from '../../core/laws/law.models';

/*
 * The items of an act as the act page shows them. Each item has the fragment id that links to it.
 */

export interface ActHeadingEntry {
  readonly kind: 'heading';
  readonly id: string;
  readonly level: LawHeading['level'];
  readonly parts: HeadingParts;
}

export interface ActNoteEntry {
  readonly kind: 'note';
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export interface ActArticleEntry {
  readonly kind: 'article';
  readonly id: string;
  readonly article: LawArticle;
  /** HTML heading level of the article header: one below the act heading above it. */
  readonly headingLevel: number;
}

export type ActEntry = ActHeadingEntry | ActNoteEntry | ActArticleEntry;

/** Fragment id of an article: "art-25а", "art-§1". */
export const articleAnchor = (number: string) => `art-${number}`;

/**
 * The items of an act, ready for the act page. The page title is h1 and an act heading of
 * outline level N is h(N + 1) (see ActHeading), so an article header below it is h(N + 2).
 */
export function toEntries(items: readonly LawItem[]): ActEntry[] {
  let outlineLevel = 0;
  return items.map((item, index): ActEntry => {
    if (isArticle(item)) {
      return {
        kind: 'article',
        id: articleAnchor(item.number),
        article: item,
        headingLevel: outlineLevel + 2,
      };
    }
    if (item.kind === 'heading') {
      outlineLevel = item.level;
      return {
        kind: 'heading',
        id: `h-${index}`,
        level: item.level,
        parts: splitHeading(item.text),
      };
    }
    return { kind: 'note', id: `note-${index}`, title: item.title, paragraphs: item.paragraphs };
  });
}

/**
 * True when an article matches a filter: its number ("25", "чл. 25") or a word of its
 * Bulgarian or English text. The query must be in lower case.
 */
export function matchesQuery(
  article: LawArticle,
  translations: ActTranslation,
  query: string,
): boolean {
  const number = query.replace(/^(?:чл|art)\.?\s*/, '');
  if (article.number.toLowerCase() === number) return true;
  const texts = [
    article.title,
    ...article.paragraphs,
    ...(translations[article.number]?.paragraphs ?? []),
  ];
  return texts.some((text) => text?.toLowerCase().includes(query));
}
