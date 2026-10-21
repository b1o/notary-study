import { HttpClient } from '@angular/common/http';
import { computed, inject, resource, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { LanguageService } from '../i18n/language.service';
import { articleKey, parseReference, type LawReference } from '../laws/citation';
import { citationSites, mergeSites, type CitationSite } from './citation-sites';
import type { GlossaryTerm } from './content.models';
import { ContentService } from './content.service';

/**
 * Cross references of the course: which chapter sections and glossary terms cite an article.
 * The chapter texts load only when something asks for them (see `load`).
 */
@Service()
export class CourseIndexService {
  private readonly http = inject(HttpClient);
  private readonly content = inject(ContentService);
  private readonly language = inject(LanguageService);
  private readonly requested = signal(false);

  private readonly index = resource({
    params: () => {
      const chapters = this.content.chapters();
      return this.requested() && chapters.length ? { chapters, language: this.language.current() } : undefined;
    },
    loader: async ({ params: { chapters, language } }) => {
      const [texts, glossary] = await Promise.all([
        Promise.all(
          chapters.map((chapter) =>
            firstValueFrom(this.http.get(this.content.chapterTextUrl(chapter, language), { responseType: 'text' })),
          ),
        ),
        firstValueFrom(this.http.get<GlossaryTerm[]>('data/glossary.json')),
      ]);
      return {
        sites: mergeSites(chapters.map((chapter, i) => citationSites(chapter.id, texts[i]))),
        glossary,
      };
    },
  });

  readonly isLoading = computed(() => this.index.isLoading());

  /** Start loading the chapter texts. Safe to call many times. */
  load(): void {
    this.requested.set(true);
  }

  /** Chapter sections that cite the article of the reference (any paragraph). */
  sitesFor(reference: LawReference): readonly CitationSite[] {
    return this.index.hasValue() ? (this.index.value().sites.get(articleKey(reference)) ?? []) : [];
  }

  /** Glossary terms whose references include the article. */
  termsFor(reference: LawReference): readonly GlossaryTerm[] {
    if (!this.index.hasValue()) {
      return [];
    }
    const key = articleKey(reference);
    return this.index.value().glossary.filter((term) => term.refs.some((ref) => articleKey(parseReference(ref)) === key));
  }
}
