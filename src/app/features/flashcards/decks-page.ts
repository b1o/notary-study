import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { ChapterMeta } from '../../core/content/content.models';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { FlashcardsService } from '../../core/study/flashcards.service';
import { ChapterList, ChapterRowEnd } from '../../shared/course/chapter-list';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';

/** The flashcard decks: today's review, all chapters, the glossary, and one deck per chapter. */
@Component({
  selector: 'nc-decks-page',
  imports: [RouterLink, PageLayout, PageHeader, ChapterList, ChapterRowEnd, LoadStatus],
  template: `
    @let text = ui();
    <nc-page-layout>
      <nc-page-header pageHeader [heading]="text.nav.flashcards" [lead]="text.flashcards.lead" />

      <ul class="row-list main-decks">
        <li>
          <a class="row-link" routerLink="/flashcards/due">
            <span class="row-link__title">{{ text.flashcards.due }}</span>
            <span class="row-link__detail">{{
              text.flashcards.dueCount(flashcards.dueCount())
            }}</span>
          </a>
        </li>
        <li>
          <a class="row-link" routerLink="/flashcards/all">
            <span class="row-link__title">{{ text.flashcards.all }}</span>
          </a>
        </li>
        <li>
          <a class="row-link" routerLink="/flashcards/glossary">
            <span class="row-link__title">{{ text.flashcards.glossaryDeck }}</span>
          </a>
        </li>
      </ul>

      <h2 class="section-title">{{ text.flashcards.byChapter }}</h2>
      <nc-load-status [resource]="content.manifest" />
      <nc-chapter-list [parts]="content.outline()" [link]="deckLink" [summaries]="false">
        <ng-template ncChapterRowEnd let-chapter>
          @if (flashcards.learnedCount(chapter.id); as learned) {
            <span class="done-mark">{{ text.flashcards.learned(learned) }}</span>
          }
        </ng-template>
      </nc-chapter-list>
    </nc-page-layout>
  `,
  styles: `
    .main-decks {
      max-inline-size: 36rem;
      margin-block-end: var(--space-7);
    }
  `,
})
export default class DecksPage {
  protected readonly content = inject(ContentService);
  protected readonly flashcards = inject(FlashcardsService);
  protected readonly ui = inject(LanguageService).text;
  protected readonly deckLink = (chapter: ChapterMeta) => ['/flashcards', chapter.id];

  constructor() {
    pageTitleEffect(() => this.ui().nav.flashcards);
  }
}
