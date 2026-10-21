import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { ChapterMeta } from '../../core/content/content.models';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { CHAPTER_PASS_MARK, EXAM_PASS_MARK, EXAM_SIZE } from '../../core/study/quiz';
import { formatDate } from '../../core/text/format';
import { ChapterList, ChapterRowEnd } from '../../shared/course/chapter-list';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';

/** How many earlier exam attempts the page lists. */
const SHOWN_ATTEMPTS = 8;

/** The tests: the final exam with earlier attempts, and the test of each chapter. */
@Component({
  selector: 'nc-tests-page',
  imports: [RouterLink, PageLayout, PageHeader, ChapterList, ChapterRowEnd, Icon, LoadStatus],
  templateUrl: './tests-page.html',
  styleUrl: './tests-page.scss',
})
export default class TestsPage {
  protected readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;

  protected readonly examSize = EXAM_SIZE;
  protected readonly examPassMark = EXAM_PASS_MARK;
  protected readonly chapterPassMark = CHAPTER_PASS_MARK;
  protected readonly testLink = (chapter: ChapterMeta) => ['/tests', chapter.id];

  protected readonly attempts = computed(() =>
    this.progress
      .exams()
      .slice(0, SHOWN_ATTEMPTS)
      .map((attempt) => ({ ...attempt, date: formatDate(attempt.at, this.language.current()) })),
  );

  constructor() {
    pageTitleEffect(() => this.ui().nav.tests);
  }
}
