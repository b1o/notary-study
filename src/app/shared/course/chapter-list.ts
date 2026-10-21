import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, Directive, inject, input, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { ChapterMeta } from '../../core/content/content.models';
import type { PartOutline } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';

/**
 * The detail at the end of each chapter row, for example the reading time or a test score:
 *   <ng-template ncChapterRowEnd let-chapter>{{ chapter.minutes }} min</ng-template>
 */
@Directive({ selector: 'ng-template[ncChapterRowEnd]' })
export class ChapterRowEnd {
  /** Tells the template type checker that `let-chapter` is a ChapterMeta. Angular never calls it. */
  static ngTemplateContextGuard(
    _directive: ChapterRowEnd,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- used only in the type predicate
    context: unknown,
  ): context is { $implicit: ChapterMeta } {
    return true;
  }
}

/**
 * The chapters of the course, grouped by part. Each row links to `link(chapter)`. The course
 * contents on the home page, the chapter tests and the flashcard decks all use it.
 */
@Component({
  selector: 'nc-chapter-list',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './chapter-list.html',
  styleUrl: './chapter-list.scss',
  host: { class: 'section-columns' },
})
export class ChapterList {
  readonly parts = input.required<readonly PartOutline[]>();
  readonly link = input.required<(chapter: ChapterMeta) => readonly unknown[]>();
  /** Show the summary of each chapter under its title. */
  readonly summaries = input(true);

  protected readonly rowEnd = contentChild(ChapterRowEnd, { read: TemplateRef });
  protected readonly lang = inject(LanguageService).current;
}
