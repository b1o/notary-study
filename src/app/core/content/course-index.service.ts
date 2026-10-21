import { computed, inject, resource, Service, signal } from '@angular/core';

import { LanguageService } from '../i18n/language.service';
import { articleKey, parseReference, type LawReference } from '../laws/citation';
import { GlossaryService } from '../reference/glossary.service';
import { citationSites, mergeSites, type CitationSite } from './citation-sites';
import type { GlossaryTerm } from './content.models';
import { ContentService } from './content.service';

/**
 * Cross references of the course: which chapter sections and glossary terms cite an article.
 * The chapter texts load only when something asks for them (see `load`).
 */
@Service()
export class CourseIndexService {
  private readonly content = inject(ContentService);
  private readonly language = inject(LanguageService);
  private readonly glossary = inject(GlossaryService);
  private readonly requested = signal(false);

  private readonly sites = resource({
    params: () => {
      const chapters = this.content.chapters();
      return this.requested() && chapters.length
        ? { chapters, language: this.language.current() }
        : undefined;
    },
    loader: async ({ params: { chapters, language } }) => {
      const texts = await Promise.all(
        chapters.map((chapter) => this.content.loadText(chapter, language)),
      );
      return mergeSites(chapters.map((chapter, i) => citationSites(chapter.id, texts[i])));
    },
  });

  readonly isLoading = computed(() => this.sites.isLoading());

  /** Start loading the chapter texts. Safe to call many times. */
  load(): void {
    this.requested.set(true);
  }

  /** Chapter sections that cite the article of the reference (any paragraph). */
  sitesFor(reference: LawReference): readonly CitationSite[] {
    return this.sites.hasValue() ? (this.sites.value().get(articleKey(reference)) ?? []) : [];
  }

  /** Glossary terms whose references include the article. */
  termsFor(reference: LawReference): readonly GlossaryTerm[] {
    const key = articleKey(reference);
    return this.glossary
      .terms()
      .filter((term) => term.refs.some((ref) => articleKey(parseReference(ref)) === key));
  }
}
