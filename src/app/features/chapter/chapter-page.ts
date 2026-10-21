import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import type { ChapterData } from '../../core/content/content.models';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { scrollToTarget } from '../../shared/dom/scroll-to-target';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';
import { MarkdownContent } from '../../shared/ui/markdown-content';

/** One chapter of the course: objectives, the text with its contents, and the way to the next chapter. */
@Component({
  selector: 'nc-chapter-page',
  imports: [RouterLink, Icon, LoadStatus, MarkdownContent],
  templateUrl: './chapter-page.html',
  styleUrl: './chapter-page.scss',
})
export default class ChapterPage {
  /** From the route: course/:chapterId */
  readonly chapterId = input.required<string>();

  protected readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly markdown = inject(MarkdownService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly chapter = computed(() => this.content.chapter(this.chapterId()));
  protected readonly part = computed(() => {
    const chapter = this.chapter();
    return chapter && this.content.parts().find((part) => part.id === chapter.part);
  });
  protected readonly neighbours = computed(() => this.content.neighbours(this.chapterId()));
  protected readonly isRead = computed(() => this.progress.isRead(this.chapterId()));

  protected readonly source = httpResource.text(() => {
    const chapter = this.chapter();
    return chapter && this.content.chapterTextUrl(chapter, this.lang());
  });
  protected readonly data = httpResource<ChapterData>(() => {
    const chapter = this.chapter();
    return chapter && this.content.chapterDataUrl(chapter, this.lang());
  });

  /** Renders again when the text arrives, and when the language or the law catalog changes. */
  protected readonly rendered = computed(() =>
    this.source.hasValue() ? this.markdown.render(this.source.value()) : undefined,
  );

  /** The manifest is there, but it has no chapter with this id. */
  protected readonly notFound = computed(() => this.content.manifest.hasValue() && !this.chapter());

  private readonly fragment = toSignal(inject(ActivatedRoute).fragment);

  constructor() {
    pageTitleEffect(() => this.chapter()?.title[this.lang()]);

    effect(() => {
      const chapter = this.chapter();
      if (chapter) untracked(() => this.progress.recordVisit(chapter.id));
    });

    // A link such as /course/deeds#the-draft arrives before the text; scroll when the text is there.
    scrollToTarget(() => (this.rendered() ? (this.fragment() ?? undefined) : undefined));
  }

  protected toggleRead(): void {
    this.progress.setRead(this.chapterId(), !this.isRead());
  }
}
