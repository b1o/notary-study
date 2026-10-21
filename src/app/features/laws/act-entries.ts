import { typedArticle } from '../../core/laws/citation';
import { splitHeading, type HeadingParts } from '../../core/laws/law-text';
import {
  isArticle,
  type LawArticle,
  type LawHeading,
  type LawItem,
} from '../../core/laws/law.models';
import { filterItems } from '../../core/search/search';
import type { LawDocument } from '../../core/search/search-index';

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
 * The numbers of the articles that the filter of an act keeps: the article that the query names
 * by its number ("25", "чл. 25", "28a", "§ 1"), and the articles with every word of the query in
 * their Bulgarian or English text, in any form ("нотариален" also finds "нотариалния").
 */
export function filterArticles(documents: readonly LawDocument[], query: string): Set<string> {
  const number = typedArticle(query);
  const kept = new Set(filterItems(documents, query).map((document) => document.reference.article));
  if (number && documents.some((document) => document.reference.article === number)) {
    kept.add(number);
  }
  return kept;
}
