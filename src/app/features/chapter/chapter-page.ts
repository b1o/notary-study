import { Component, computed, effect, inject, input, resource, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { scrollToTarget } from '../../shared/dom/scroll-to-target';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageHeader, type BackLink } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';
import { MarkdownContent } from '../../shared/ui/markdown-content';
import { OutlineList, type OutlineItem } from '../../shared/ui/outline-list';

/** One chapter of the course: objectives, the text with its contents, and the way to the next chapter. */
@Component({
  selector: 'nc-chapter-page',
  imports: [
    RouterLink,
    PageLayout,
    PageHeader,
    MissingPage,
    OutlineList,
    Icon,
    LoadStatus,
    MarkdownContent,
  ],
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
  /** Back to the course contents, labelled with the part: "Part 4: Notarial procedure". */
  protected readonly partLink = computed<BackLink | undefined>(() => {
    const chapter = this.chapter();
    const part = chapter && this.content.parts().find((candidate) => candidate.id === chapter.part);
    if (!part) return undefined;
    const label = `${this.ui().chapter.part(this.content.partNumber(part.id))}: ${part.title[this.lang()]}`;
    return { label, link: '/' };
  });
  protected readonly neighbours = computed(() => this.content.neighbours(this.chapterId()));
  protected readonly isRead = computed(() => this.progress.isRead(this.chapterId()));

  /** The chapter and the language whose files to load. */
  private readonly files = computed(() => {
    const chapter = this.chapter();
    return chapter && { chapter, language: this.lang() };
  });
  protected readonly source = resource({
    params: this.files,
    loader: ({ params }) => this.content.loadText(params.chapter, params.language),
  });
  protected readonly data = resource({
    params: this.files,
    loader: ({ params }) => this.content.loadData(params.chapter, params.language),
  });

  /** Renders again when the text arrives, and when the language or the law catalog changes. */
  protected readonly rendered = computed(() =>
    this.source.hasValue() ? this.markdown.render(this.source.value()) : undefined,
  );

  /** The headings of the text, for the contents column. */
  protected readonly outline = computed<OutlineItem[]>(
    () =>
      this.rendered()?.toc.map((entry) => ({
        id: entry.id,
        title: entry.text,
        depth: entry.level - 2,
      })) ?? [],
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
