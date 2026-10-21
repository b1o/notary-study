import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { LANGUAGES } from '../../core/i18n/language';
import { LanguageService } from '../../core/i18n/language.service';
import { LawDisplayService } from '../../core/laws/law-display.service';
import { LawLibraryService } from '../../core/laws/law-library.service';
import type { ActTranslation } from '../../core/laws/law.models';
import { pageTitleEffect } from '../../core/page-title';
import { lawDocuments } from '../../core/search/search-index';
import { scrollToTarget } from '../../shared/dom/scroll-to-target';
import { LawArticleText } from '../../shared/law/law-article-text';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageLayout } from '../../shared/layout/page-layout';
import { ChoiceGroup, toChoices } from '../../shared/ui/choice-group';
import { LoadStatus } from '../../shared/ui/load-status';
import { Notice } from '../../shared/ui/notice';
import { OutlineList, type OutlineItem } from '../../shared/ui/outline-list';
import { articleAnchor, filterArticles, toEntries, type ActEntry } from './act-entries';
import { ActHeader } from './act-header';
import { ActHeading } from './act-heading';

/**
 * The whole text of an act. With an article in the URL (laws/znnd/25?paragraph=9),
 * the page scrolls to the article and marks the paragraph.
 */
@Component({
  selector: 'nc-act-page',
  imports: [
    FormField,
    PageLayout,
    MissingPage,
    OutlineList,
    Notice,
    ChoiceGroup,
    LawArticleText,
    LoadStatus,
    ActHeading,
    ActHeader,
  ],
  templateUrl: './act-page.html',
  styleUrl: './act-page.scss',
})
export default class ActPage {
  /** From the route: laws/:actId and laws/:actId/:article */
  readonly actId = input.required<string>();
  readonly article = input<string>();
  /** From the query string: ?paragraph=9 */
  readonly paragraph = input<string>();

  protected readonly laws = inject(LawLibraryService);
  protected readonly display = inject(LawDisplayService);
  protected readonly ui = inject(LanguageService).text;

  protected readonly entry = computed(() => this.laws.entry(this.actId()));
  protected readonly act = resource({
    params: () => this.actId(),
    loader: ({ params: actId }) => this.laws.loadAct(actId),
  });
  private readonly translations = resource({
    params: () => this.actId(),
    loader: ({ params: actId }) => this.laws.loadTranslation(actId),
  });
  protected readonly translationOf = computed<ActTranslation>(() =>
    this.translations.hasValue() ? this.translations.value() : {},
  );

  protected readonly filter = form(signal(''));
  protected readonly hideAmendments = form(this.display.hideAmendments);
  protected readonly textLanguageChoices = computed(() =>
    toChoices(LANGUAGES, this.ui().law.textLanguages),
  );

  private readonly entries = computed<ActEntry[]>(() =>
    this.act.hasValue() ? toEntries(this.act.value().act.items) : [],
  );
  protected readonly headings = computed(() =>
    this.entries().filter((entry) => entry.kind === 'heading'),
  );

  /** The headings for the contents column. */
  protected readonly outline = computed<OutlineItem[]>(() =>
    this.headings().map(({ id, level, parts }) => ({
      id,
      title: parts.title,
      label: parts.label,
      depth: level - 1,
      caps: parts.caps,
    })),
  );

  /** The articles with their translations, as the search compares them. */
  private readonly documents = computed(() =>
    this.act.hasValue() ? lawDocuments(this.act.value().act, this.translationOf()) : [],
  );

  /** All items; with a filter, only the matching articles. */
  protected readonly visibleEntries = computed(() => {
    const query = this.filter().value().trim();
    if (!query) return this.entries();
    const kept = filterArticles(this.documents(), query);
    return this.entries().filter(
      (entry) => entry.kind === 'article' && kept.has(entry.article.number),
    );
  });

  /** The catalog is there, but it has no act with this id. */
  protected readonly actMissing = computed(() => this.laws.catalog.hasValue() && !this.entry());
  /** The act is there, but the article in the URL is not in it (for example in an extract). */
  protected readonly articleMissing = computed(() => {
    const article = this.article();
    return !!article && this.act.hasValue() && !this.act.value().context(article);
  });

  constructor() {
    pageTitleEffect(() => {
      const article = this.article();
      return article ? this.laws.label({ act: this.actId(), article }) : this.entry()?.abbr;
    });
    // Wait for the translations too: they add text above the article and would move it down.
    scrollToTarget(() => {
      const article = this.article();
      const ready = this.entries().length > 0 && !this.translations.isLoading();
      return article && ready ? articleAnchor(article) : undefined;
    });
  }
}
