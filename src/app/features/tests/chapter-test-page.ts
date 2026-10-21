import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { CHAPTER_PASS_MARK, chapterTest } from '../../core/study/quiz';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { QuizRunner } from './quiz-runner';

/** The test of one chapter: every question of the chapter; the answers show at the end. */
@Component({
  selector: 'nc-chapter-test-page',
  imports: [RouterLink, PageLayout, PageHeader, MissingPage, QuizRunner, LoadStatus],
  templateUrl: './chapter-test-page.html',
})
export default class ChapterTestPage {
  /** From the route: tests/:chapterId */
  readonly chapterId = input.required<string>();

  protected readonly content = inject(ContentService);
  private readonly progress = inject(ProgressService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;
  protected readonly passMark = CHAPTER_PASS_MARK;

  protected readonly chapter = computed(() => this.content.chapter(this.chapterId()));
  protected readonly nextChapter = computed(() => this.content.neighbours(this.chapterId()).next);

  protected readonly data = resource({
    params: () => {
      const chapter = this.chapter();
      return chapter && { chapter, language: this.lang() };
    },
    loader: ({ params }) => this.content.loadData(params.chapter, params.language),
  });

  /** Counts the attempts: each new attempt shuffles the questions again. */
  private readonly attempt = signal(0);
  /** The last attempt passed: the result then offers the next chapter. */
  protected readonly passed = signal(false);
  protected readonly items = computed(() => {
    this.attempt();
    return this.data.hasValue() ? chapterTest(this.chapterId(), this.data.value().quiz) : [];
  });

  /** The course is there, but it has no chapter with this id. */
  protected readonly missing = computed(() => this.content.manifest.hasValue() && !this.chapter());

  constructor() {
    pageTitleEffect(() => {
      const chapter = this.chapter();
      return chapter && `${this.ui().tests.chapterTest}: ${chapter.title[this.lang()]}`;
    });
  }

  protected record(score: number): void {
    this.progress.recordTest(this.chapterId(), score);
    this.passed.set(score >= this.passMark);
  }

  protected retry(): void {
    this.passed.set(false);
    this.attempt.update((attempt) => attempt + 1);
  }
}
