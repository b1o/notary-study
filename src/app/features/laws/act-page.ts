import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { LAW_TEXT_LANGUAGES, LawDisplayService } from '../../core/laws/law-display.service';
import { LawLibraryService } from '../../core/laws/law-library.service';
import {
  isArticle,
  type ActTranslation,
  type LawArticle,
  type LawItem,
} from '../../core/laws/law.models';
import { pageTitleEffect } from '../../core/page-title';
import { scrollToTarget } from '../../shared/dom/scroll-to-target';
import { LawArticleText } from '../../shared/law/law-article-text';
import { ChoiceGroup, toChoices } from '../../shared/ui/choice-group';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';

/** One item of the act with the fragment id that links to it. */
type ActEntry =
  | { readonly kind: 'heading'; readonly id: string; readonly level: 1 | 2; readonly text: string }
  | {
      readonly kind: 'note';
      readonly id: string;
      readonly title: string;
      readonly paragraphs: readonly string[];
    }
  | { readonly kind: 'article'; readonly id: string; readonly article: LawArticle };

/** Fragment id of an article: "art-25а", "art-§1". */
const articleAnchor = (number: string) => `art-${number}`;

/**
 * The whole text of an act. With an article in the URL (laws/znnd/25?paragraph=9),
 * the page scrolls to the article and marks the paragraph.
 */
@Component({
  selector: 'nc-act-page',
  imports: [RouterLink, FormField, NgTemplateOutlet, Icon, ChoiceGroup, LawArticleText, LoadStatus],
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
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

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
    toChoices(LAW_TEXT_LANGUAGES, this.ui().law.textLanguages),
  );

  private readonly entries = computed<ActEntry[]>(() =>
    this.act.hasValue() ? this.act.value().act.items.map(toEntry) : [],
  );
  protected readonly headings = computed(() =>
    this.entries().filter((entry) => entry.kind === 'heading'),
  );

  /** All items; with a filter, only the matching articles. */
  protected readonly visibleEntries = computed(() => {
    const query = this.filter().value().trim().toLowerCase();
    if (!query) return this.entries();
    const translations = this.translationOf();
    return this.entries().filter(
      (entry) => entry.kind === 'article' && matches(entry.article, translations, query),
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

function toEntry(item: LawItem, index: number): ActEntry {
  if (isArticle(item)) return { kind: 'article', id: articleAnchor(item.number), article: item };
  if (item.kind === 'heading')
    return { kind: 'heading', id: `h-${index}`, level: item.level, text: item.text };
  return { kind: 'note', id: `note-${index}`, title: item.title, paragraphs: item.paragraphs };
}

/** An article matches its number ("25", "чл. 25") or a word of its Bulgarian or English text. */
function matches(article: LawArticle, translations: ActTranslation, query: string): boolean {
  const number = query.replace(/^(?:чл|art)\.?\s*/, '');
  if (article.number.toLowerCase() === number) return true;
  const texts = [
    article.title,
    ...article.paragraphs,
    ...(translations[article.number]?.paragraphs ?? []),
  ];
  return texts.some((text) => text?.toLowerCase().includes(query));
}
