import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { scorePercent, type QuizItem } from '../../core/study/quiz';
import { LawRefs } from '../../shared/law/law-refs';
import { MarkdownContent } from '../../shared/ui/markdown-content';

/**
 * learn  each answer is checked at once, with the explanation (chapter tests)
 * exam   the answers show only at the end (final exam)
 */
export type QuizMode = 'learn' | 'exam';

/**
 * Asks a list of questions one by one, then shows the score and the mistakes.
 * A new list of items starts the quiz again. The page puts its buttons for the result
 * (repeat, back) in the quizActions slot.
 */
@Component({
  selector: 'nc-quiz-runner',
  imports: [RouterLink, LawRefs, MarkdownContent],
  templateUrl: './quiz-runner.html',
  styleUrl: './quiz-runner.scss',
})
export class QuizRunner {
  readonly items = input.required<readonly QuizItem[]>();
  readonly mode = input.required<QuizMode>();
  readonly passMark = input.required<number>();
  /** The result message: one for a pass, one for a fail. */
  readonly messages = input.required<{ readonly passed: string; readonly failed: string }>();
  /** Emits the score in percent when the last question is answered. */
  readonly finished = output<number>();

  private readonly markdown = inject(MarkdownService);
  private readonly content = inject(ContentService);
  protected readonly ui = inject(LanguageService).text;

  protected readonly index = linkedSignal({ source: this.items, computation: () => 0 });
  private readonly answers = linkedSignal<readonly QuizItem[], number[]>({
    source: this.items,
    computation: () => [],
  });
  /** The option picked for the current question. */
  protected readonly selected = linkedSignal<number, number | undefined>({
    source: this.index,
    computation: () => undefined,
  });
  /** Learn mode: the current answer is checked and its explanation shows. */
  protected readonly checked = linkedSignal({ source: this.index, computation: () => false });

  protected readonly done = computed(
    () => this.items().length > 0 && this.index() >= this.items().length,
  );
  protected readonly isLast = computed(() => this.index() === this.items().length - 1);

  protected readonly current = computed(() => {
    const item = this.items()[this.index()];
    return item && this.render(item);
  });

  protected readonly score = computed(() => scorePercent(this.items(), this.answers()));
  protected readonly rightCount = computed(
    () => this.items().filter((item, i) => this.answers()[i] === item.answer).length,
  );
  protected readonly passed = computed(() => this.score() >= this.passMark());

  /** The wrong answers, with the right ones and their explanations. */
  protected readonly mistakes = computed(() => {
    if (!this.done()) return [];
    return this.items().flatMap((item, i) => {
      const answer = this.answers()[i];
      if (answer === item.answer) return [];
      const rendered = this.render(item);
      const chapter = this.content.chapter(item.chapterId);
      return [
        {
          ...rendered,
          yourAnswerHtml: rendered.optionsHtml[answer],
          rightAnswerHtml: rendered.optionsHtml[item.answer],
          chapter,
        },
      ];
    });
  });

  private readonly question = viewChild<ElementRef<HTMLElement>>('question');

  constructor() {
    // After each new question, move the focus to it, so keyboard and screen reader users follow.
    let first = true;
    afterRenderEffect(() => {
      this.index();
      const question = this.question()?.nativeElement;
      if (first) {
        first = false;
        return;
      }
      question?.focus();
    });
  }

  /** Learn mode: check the answer and show the explanation. Exam mode: go on at once. */
  protected answer(): void {
    const selected = this.selected();
    if (selected === undefined) return;
    this.answers.update((answers) => {
      const copy = [...answers];
      copy[this.index()] = selected;
      return copy;
    });
    if (this.mode() === 'exam') this.next();
    else this.checked.set(true);
  }

  protected next(): void {
    this.index.update((index) => index + 1);
    if (this.done()) this.finished.emit(this.score());
  }

  private render(item: QuizItem) {
    return {
      item,
      questionHtml: this.markdown.renderInline(item.question),
      optionsHtml: item.options.map((option) => this.markdown.renderInline(option)),
      explanationHtml: this.markdown.renderInline(item.explanation),
    };
  }
}
