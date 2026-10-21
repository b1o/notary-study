import type { Localized } from '../i18n/language';

/** Shapes of the JSON files in public/data/laws, written by tools/import_laws.py. */

export type LawGroup = 'notary' | 'civil' | 'commercial' | 'registers' | 'tax' | 'aml' | 'other';

/** The order in which the law library lists the groups. */
export const LAW_GROUPS: readonly LawGroup[] = [
  'notary',
  'civil',
  'commercial',
  'registers',
  'tax',
  'aml',
  'other',
];

/** One entry of public/data/laws/catalog.json. */
export interface LawCatalogEntry {
  readonly id: string;
  /** Bulgarian abbreviation, for example "ЗННД". */
  readonly abbr: string;
  readonly title: Localized;
  readonly group: LawGroup;
  readonly source: string;
  /** ISO date on which the text was downloaded. */
  readonly retrieved: string;
  /** True when the library holds only the articles that the course needs. */
  readonly partial: boolean;
  readonly articles: number;
  readonly inForce?: string;
  readonly published?: string;
  readonly lastChange?: string;
  /** Name of the numbered unit when it is not "чл." (the tariff uses "т." items). */
  readonly unit?: Localized;
  readonly note?: Localized;
}

export interface LawHeading {
  readonly kind: 'heading';
  /**
   * Depth in the outline of the act, 1 for the outermost headings: usually 1 for a chapter
   * (глава) and 2 for a section (раздел). Older acts such as ЗЗД go down to 4
   * (част, I., 1., А)). tools/import_laws.py sets the levels.
   */
  readonly level: 1 | 2 | 3 | 4;
  readonly text: string;
}

/** An article (чл.) or a provision of the additional and final provisions (§). */
export interface LawArticle {
  readonly kind: 'article' | 'provision';
  /** "25", "25а" (Cyrillic letter) or "§1". */
  readonly number: string;
  readonly title?: string;
  /** One entry per paragraph or item, as in the source. */
  readonly paragraphs: readonly string[];
}

/** Text that is not an article, for example the list of related EU acts. */
export interface LawNote {
  readonly kind: 'note';
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export type LawItem = LawHeading | LawArticle | LawNote;

/** public/data/laws/acts/<id>.json */
export interface LawAct extends LawCatalogEntry {
  readonly items: readonly LawItem[];
}

export interface ArticleTranslation {
  readonly title?: string;
  readonly paragraphs: readonly string[];
}

/** public/data/laws/en/<id>.json: unofficial English translations by article number. */
export type ActTranslation = Readonly<Record<string, ArticleTranslation>>;

export function isArticle(item: LawItem): item is LawArticle {
  return item.kind === 'article' || item.kind === 'provision';
}
