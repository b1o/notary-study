import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  resource,
  untracked,
} from '@angular/core';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { FlashcardsService, SPECIAL_DECKS } from '../../core/study/flashcards.service';
import { BOX_DAYS, studyOrder } from '../../core/study/leitner';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { MarkdownContent } from '../../shared/ui/markdown-content';

/**
 * Study one deck. The order is fixed when the deck opens (due cards first, then the lower
 * boxes), so a graded card does not jump back into the queue during the session.
 * Keys: Space shows the answer, 1 means "Again", 2 means "I knew it".
 */
@Component({
  selector: 'nc-deck-page',
  imports: [PageLayout, PageHeader, MissingPage, MarkdownContent, LoadStatus],
  templateUrl: './deck-page.html',
  styleUrl: './deck-page.scss',
  host: {
    '(document:keydown)': 'onKey($event)',
  },
})
export default class DeckPage {
  /** From the route: flashcards/:deck, a chapter id or "due", "all", "glossary". */
  readonly deck = input.required<string>();

  protected readonly flashcards = inject(FlashcardsService);
  private readonly content = inject(ContentService);
  private readonly markdown = inject(MarkdownService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly cards = resource({
    params: () =>
      this.content.chapters().length ? { deck: this.deck(), language: this.lang() } : undefined,
    loader: ({ params }) => this.flashcards.loadDeck(params.deck, params.language),
  });

  /** The deck in study order, fixed for this session: grading does not reorder it. */
  private readonly queue = computed(() => {
    const cards = this.cards.hasValue() ? this.cards.value() : [];
    return untracked(() =>
      studyOrder(cards, (card) => this.flashcards.state(card.key), Date.now()),
    );
  });
  protected readonly position = linkedSignal({ source: this.queue, computation: () => 0 });
  protected readonly flipped = linkedSignal({ source: this.position, computation: () => false });
  protected readonly total = computed(() => this.queue().length);

  protected readonly card = computed(() => {
    const card = this.queue()[this.position()];
    if (!card) return undefined;
    const chapter = card.chapterId ? this.content.chapter(card.chapterId) : undefined;
    return {
      ...card,
      frontHtml: this.markdown.renderInline(card.front),
      backHtml: this.markdown.render(card.back).html,
      box: this.flashcards.state(card.key).box,
      chapterNumber: card.chapterId !== this.deck() ? chapter?.number : undefined,
    };
  });

  /** How many cards of the deck are in each box (0 = new). */
  protected readonly boxes = computed(() => {
    const counts = BOX_DAYS.map(() => 0);
    for (const card of this.queue()) counts[this.flashcards.state(card.key).box]++;
    return counts;
  });

  protected readonly title = computed(() => {
    const text = this.ui().flashcards;
    const deck = this.deck();
    const titles: Record<string, string> = {
      due: text.due,
      all: text.all,
      glossary: text.glossaryDeck,
    };
    const chapter = this.content.chapter(deck);
    return titles[deck] ?? (chapter ? `${chapter.number}. ${chapter.title[this.lang()]}` : '');
  });

  /** The course is there, but the deck is neither a chapter nor one of the special decks. */
  protected readonly missing = computed(
    () =>
      this.content.manifest.hasValue() &&
      !this.content.chapter(this.deck()) &&
      !(SPECIAL_DECKS as readonly string[]).includes(this.deck()),
  );

  constructor() {
    pageTitleEffect(() => this.title() || undefined);
  }

  protected grade(knewIt: boolean): void {
    const card = this.card();
    if (!card) return;
    this.flashcards.grade(card.key, knewIt);
    this.position.update((position) => position + 1);
  }

  protected restart(): void {
    this.position.set(0);
  }

  /** Space shows the answer (unless a button or link has the focus: then Space presses it). */
  protected onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (!this.card() || target?.closest('input, textarea, select')) return;
    if (event.key === ' ' && !this.flipped() && !target?.closest('button, a')) {
      event.preventDefault();
      this.flipped.set(true);
    } else if (this.flipped() && (event.key === '1' || event.key === '2')) {
      this.grade(event.key === '2');
    }
  }
}
