import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_SECTIONS } from '../../app-sections';
import type { ChapterMeta } from '../../core/content/content.models';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { ChapterList, ChapterRowEnd } from '../../shared/course/chapter-list';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';

/** The start page: where to continue, the reference tools and all chapters. */
@Component({
  selector: 'nc-home-page',
  imports: [RouterLink, PageLayout, PageHeader, ChapterList, ChapterRowEnd, Icon, LoadStatus],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export default class HomePage {
  protected readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;
  protected readonly sections = APP_SECTIONS;
  protected readonly chapterLink = (chapter: ChapterMeta) => ['/course', chapter.id];

  /** The chapter to continue with: the last one opened, or the first one. */
  protected readonly nextChapter = computed(() => {
    const last = this.progress.lastChapter();
    const chapter = last ? this.content.chapter(last) : undefined;
    return chapter ?? this.content.chapters()[0];
  });

  constructor() {
    pageTitleEffect(() => undefined);
  }
}
