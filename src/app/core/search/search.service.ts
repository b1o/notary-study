import { inject, Service } from '@angular/core';

import type { ChapterMeta } from '../content/content.models';
import { ContentService } from '../content/content.service';
import { PromiseCache } from '../data/promise-cache';
import type { Language } from '../i18n/language';
import { LawLibraryService } from '../laws/law-library.service';
import type { LawCatalogEntry } from '../laws/law.models';
import { GlossaryService } from '../reference/glossary.service';
import { findMatches, type MatchList } from './search';
import {
  courseSections,
  glossaryDocuments,
  lawDocuments,
  type CourseSection,
  type GlossaryDocument,
  type LawDocument,
} from './search-index';

/** How many matches of each kind a search shows. */
const LIMITS = { glossary: 12, course: 30, laws: 60 } as const;

export interface SearchResults {
  readonly glossary: MatchList<GlossaryDocument>;
  readonly course: MatchList<CourseSection>;
  readonly laws: MatchList<LawDocument>;
}

/**
 * Full-text search in the chapters, the laws and the glossary. The texts load on the first
 * search (all chapters of the language, all acts and their translations) and stay in memory.
 */
@Service()
export class SearchService {
  private readonly content = inject(ContentService);
  private readonly laws = inject(LawLibraryService);
  private readonly glossary = inject(GlossaryService);
  private readonly courseIndexes = new PromiseCache<readonly CourseSection[]>();
  private readonly lawIndex = new PromiseCache<readonly LawDocument[]>();

  /** `chapters` and `acts` are the manifest and the law catalog, which the caller waits for. */
  async search(
    query: string,
    language: Language,
    chapters: readonly ChapterMeta[],
    acts: readonly LawCatalogEntry[],
  ): Promise<SearchResults> {
    const [sections, articles, terms] = await Promise.all([
      this.courseIndexes.get(language, () => this.indexCourse(chapters, language)),
      this.lawIndex.get('acts', () => this.indexLaws(acts)),
      this.glossary.load(),
    ]);
    return {
      glossary: findMatches(glossaryDocuments(terms, language), query, LIMITS.glossary),
      course: findMatches(sections, query, LIMITS.course),
      laws: findMatches(articles, query, LIMITS.laws),
    };
  }

  private async indexCourse(
    chapters: readonly ChapterMeta[],
    language: Language,
  ): Promise<CourseSection[]> {
    const texts = await Promise.all(
      chapters.map((chapter) => this.content.loadText(chapter, language)),
    );
    const label = (ref: string) => this.laws.label(ref, language);
    return chapters.flatMap((chapter, i) => courseSections(chapter.id, texts[i], language, label));
  }

  private async indexLaws(acts: readonly LawCatalogEntry[]): Promise<LawDocument[]> {
    const documents = await Promise.all(
      acts.map(async ({ id }) => {
        const [index, translation] = await Promise.all([
          this.laws.loadAct(id),
          this.laws.loadTranslation(id),
        ]);
        return lawDocuments(index.act, translation);
      }),
    );
    return documents.flat();
  }
}
