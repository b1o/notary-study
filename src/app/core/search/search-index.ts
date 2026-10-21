import { splitSections } from '../content/markdown-sections';
import type { GlossaryTerm } from '../content/content.models';
import type { Language, Localized } from '../i18n/language';
import type { LawReference } from '../laws/citation';
import { isArticle, type ActTranslation, type LawAct } from '../laws/law.models';
import { plainMarkdown } from '../markdown/plain-markdown';
import { searchText, type Searchable } from './search';

/** A section of a chapter. */
export interface CourseSection extends Searchable {
  readonly chapterId: string;
  /** The heading and its fragment id; the text before the first heading has neither. */
  readonly heading?: string;
  readonly fragment?: string;
}

/** The sections of a chapter, as plain text. */
export function courseSections(
  chapterId: string,
  markdown: string,
  language: Language,
  citationLabel: (ref: string) => string,
): CourseSection[] {
  return splitSections(markdown).flatMap((section) => {
    const body = plainMarkdown([...section.lines, ...section.code].join('\n'), citationLabel);
    return body || section.title
      ? [
          {
            chapterId,
            heading: section.title,
            fragment: section.id,
            texts: [searchText(language, body, section.title)],
          },
        ]
      : [];
  });
}

/** An article or a provision of an act, with its English translation when there is one. */
export interface LawDocument extends Searchable {
  readonly reference: LawReference;
  /** The title of the article in each language that has it. */
  readonly title: Partial<Localized>;
}

export function lawDocuments(act: LawAct, translation: ActTranslation): LawDocument[] {
  return act.items.filter(isArticle).map((article) => {
    const english = translation[article.number];
    return {
      reference: { act: act.id, article: article.number },
      title: { bg: article.title, en: english?.title },
      texts: [
        searchText('bg', article.paragraphs.join(' '), article.title),
        ...(english ? [searchText('en', english.paragraphs.join(' '), english.title)] : []),
      ],
    };
  });
}

/** A glossary term: the definition in the course language, under the term in both languages. */
export interface GlossaryDocument extends Searchable {
  readonly term: GlossaryTerm;
}

export function glossaryDocuments(
  terms: readonly GlossaryTerm[],
  language: Language,
): GlossaryDocument[] {
  return terms.map((term) => ({
    term,
    texts: [searchText(language, term.definition[language], `${term.bg} ${term.en}`)],
  }));
}
