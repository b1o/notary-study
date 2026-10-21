import { Component, computed, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { EXAM_PASS_MARK, EXAM_SIZE, finalExam } from '../../core/study/quiz';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { QuizRunner } from './quiz-runner';

/** The final exam: random questions from all chapters; the answers show at the end. */
@Component({
  selector: 'nc-exam-page',
  imports: [RouterLink, PageLayout, PageHeader, QuizRunner, LoadStatus],
  template: `
    @let text = ui();
    <nc-page-layout main="reading">
      <nc-page-header
        pageHeader
        [heading]="text.tests.finalExam"
        [lead]="text.tests.examIntro(examSize, passMark)"
        [back]="{ label: text.nav.tests, link: '/tests' }"
      />

      <nc-load-status [resource]="chapters" />

      @if (items().length) {
        <nc-quiz-runner
          [items]="items()"
          mode="exam"
          [passMark]="passMark"
          [messages]="{ passed: text.tests.examPassed, failed: text.tests.examFailed }"
          (finished)="progress.recordExam($event)"
        >
          <ng-container ngProjectAs="[quizActions]">
            <button type="button" class="button button--primary" (click)="retry()">
              {{ text.tests.retry }}
            </button>
            <a class="button" routerLink="/tests">{{ text.nav.tests }}</a>
          </ng-container>
        </nc-quiz-runner>
      }
    </nc-page-layout>
  `,
})
export default class ExamPage {
  private readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly examSize = EXAM_SIZE;
  protected readonly passMark = EXAM_PASS_MARK;

  /** The questions of every chapter, in the reader's language. */
  protected readonly chapters = resource({
    params: () =>
      this.content.chapters().length ? { language: this.language.current() } : undefined,
    loader: async ({ params }) => {
      const data = await this.content.loadAllData(params.language);
      return data.map((chapter) => ({ chapterId: chapter.id, quiz: chapter.quiz }));
    },
  });

  /** Counts the attempts: each new attempt draws new questions. */
  private readonly attempt = signal(0);
  protected readonly items = computed(() => {
    this.attempt();
    return this.chapters.hasValue() ? finalExam(this.chapters.value()) : [];
  });

  constructor() {
    pageTitleEffect(() => this.ui().tests.finalExam);
  }

  protected retry(): void {
    this.attempt.update((attempt) => attempt + 1);
  }
}
