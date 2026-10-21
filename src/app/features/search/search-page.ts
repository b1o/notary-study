import { Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { parseCitationText, type LawReference } from '../../core/laws/citation';
import { LawLibraryService } from '../../core/laws/law-library.service';
import { LawPanelService } from '../../core/laws/law-panel.service';
import { pageTitleEffect } from '../../core/page-title';
import { SearchService } from '../../core/search/search.service';
import { GlossaryList } from '../../shared/course/glossary-list';
import { isPlainClick } from '../../shared/law/citation-click';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { SearchBox } from '../../shared/ui/search-box';
import { SearchGroup, SearchSnippet } from './search-parts';

/** Search results for /search?q=...: glossary terms, chapter sections and provisions. */
@Component({
  selector: 'nc-search-page',
  imports: [
    RouterLink,
    PageLayout,
    PageHeader,
    SearchBox,
    LoadStatus,
    GlossaryList,
    SearchGroup,
    SearchSnippet,
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export default class SearchPage {
  /** The query parameter of the address. */
  readonly q = input<string>();

  private readonly search = inject(SearchService);
  protected readonly content = inject(ContentService);
  protected readonly laws = inject(LawLibraryService);
  protected readonly panel = inject(LawPanelService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly query = computed(() => this.q()?.trim() ?? '');

  /** The search waits for the chapter list and the law catalog. */
  protected readonly results = resource({
    params: () => {
      const query = this.query();
      const chapters = this.content.chapters();
      const acts = this.laws.entries();
      return query && chapters.length && acts.length
        ? { query, language: this.lang(), chapters, acts }
        : undefined;
    },
    loader: ({ params: { query, language, chapters, acts } }) =>
      this.search.search(query, language, chapters, acts),
  });

  protected readonly glossaryTerms = computed(() =>
    this.results.hasValue()
      ? this.results.value().glossary.matches.map((match) => match.item.term)
      : [],
  );

  protected readonly nothingFound = computed(() => {
    if (!this.results.hasValue()) return false;
    const { glossary, course, laws } = this.results.value();
    return !glossary.total && !course.total && !laws.total;
  });

  /** A provision that the query names, such as "чл. 25 ЗННД": the page offers to open it. */
  protected readonly provision = computed(() => {
    const reference = parseCitationText(this.query(), this.laws.entries());
    return reference?.article ? reference : undefined;
  });

  protected readonly heading = computed(() =>
    this.query() ? this.ui().search.resultsFor(this.query()) : this.ui().search.title,
  );

  constructor() {
    pageTitleEffect(() => this.heading());
  }

  /** A provision opens in the law panel, like a citation; Ctrl/Cmd-click opens the library. */
  protected openProvision(event: MouseEvent, reference: LawReference): void {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    this.panel.open(reference);
  }
}
