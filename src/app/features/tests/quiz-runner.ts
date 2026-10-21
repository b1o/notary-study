import {
  afterRenderEffect,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { scorePercent, type QuizItem } from '../../core/study/quiz';
import { LawRefs } from '../../shared/law/law-refs';
import { ChoiceGroup, type Choice } from '../../shared/ui/choice-group';
import { Icon } from '../../shared/ui/icon';
import { MarkdownContent } from '../../shared/ui/markdown-content';

/** Which answers the review at the end shows. */
type ReviewFilter = 'all' | 'wrong';

/**
 * Asks a list of questions one by one, like an exam: it does not tell after each question
 * whether the answer is right. The reader can go back and change an answer. After the last
 * question it shows the score and a review of all answers, with the explanations.
 * A new list of items starts the quiz again. The page puts its buttons for the result
 * (repeat, back) in the quizActions slot.
 */
@Component({
  selector: 'nc-quiz-runner',
  imports: [RouterLink, LawRefs, MarkdownContent, ChoiceGroup, Icon],
  templateUrl: './quiz-runner.html',
  styleUrl: './quiz-runner.scss',
})
export class QuizRunner {
  readonly items = input.required<readonly QuizItem[]>();
  readonly passMark = input.required<number>();
  /** The result message: one for a pass, one for a fail. */
  readonly messages = input.required<{ readonly passed: string; readonly failed: string }>();
  /** The review links each question to its chapter (the exam mixes chapters). */
  readonly linkChapters = input(false);
  /** Emits the score in percent when the last question is answered. */
  readonly finished = output<number>();

  private readonly markdown = inject(MarkdownService);
  private readonly content = inject(ContentService);
  protected readonly ui = inject(LanguageService).text;

  protected readonly index = linkedSignal({ source: this.items, computation: () => 0 });
  private readonly answers = linkedSignal<readonly QuizItem[], (number | undefined)[]>({
    source: this.items,
    computation: () => [],
  });
  /** The option picked for the current question: the earlier answer when the reader goes back. */
  protected readonly selected = linkedSignal<number, number | undefined>({
    source: this.index,
    computation: (index) => this.answers()[index],
  });

  protected readonly done = computed(
    () => this.items().length > 0 && this.index() >= this.items().length,
  );
  protected readonly isLast = computed(() => this.index() === this.items().length - 1);

  protected readonly current = computed(() => {
    const item = this.items()[this.index()];
    return item && this.render(item);
  });

  protected readonly score = computed(() => scorePercent(this.items(), this.answers()));
  protected readonly passed = computed(() => this.score() >= this.passMark());

  /** Every question with the reader's answer, the right answer and the explanation. */
  protected readonly review = computed(() => {
    if (!this.done()) return [];
    return this.items().map((item, i) => {
      const answer = this.answers()[i];
      const rendered = this.render(item);
      return {
        ...rendered,
        number: i + 1,
        right: answer === item.answer,
        yourAnswerHtml: answer === undefined ? '' : rendered.optionsHtml[answer],
        rightAnswerHtml: rendered.optionsHtml[item.answer],
        chapter: this.linkChapters() ? this.content.chapter(item.chapterId) : undefined,
      };
    });
  });
  protected readonly rightCount = computed(
    () => this.review().filter((entry) => entry.right).length,
  );

  protected readonly reviewFilter = linkedSignal<readonly QuizItem[], ReviewFilter>({
    source: this.items,
    computation: () => 'all',
  });
  protected readonly reviewChoices = computed<Choice<ReviewFilter>[]>(() => {
    const text = this.ui().tests;
    const wrong = this.review().length - this.rightCount();
    return [
      { value: 'all', label: text.allAnswers(this.review().length) },
      { value: 'wrong', label: text.wrongAnswers(wrong) },
    ];
  });
  protected readonly shownReview = computed(() =>
    this.reviewFilter() === 'wrong' ? this.review().filter((entry) => !entry.right) : this.review(),
  );

  private readonly question = viewChild<ElementRef<HTMLElement>>('question');
  private readonly result = viewChild<ElementRef<HTMLElement>>('result');
  /** Set by a move between questions, so that the first question does not take the focus. */
  private readonly moved = signal(false);

  constructor() {
    // After a move to another question or to the result, the focus follows, so keyboard and
    // screen reader users stay with the content.
    afterRenderEffect(() => {
      this.index();
      if (!this.moved()) return;
      (this.result() ?? this.question())?.nativeElement.focus();
    });
  }

  protected next(): void {
    this.keepAnswer();
    this.moved.set(true);
    this.index.update((index) => index + 1);
    if (this.done()) this.finished.emit(this.score());
  }

  protected previous(): void {
    this.keepAnswer();
    this.moved.set(true);
    this.index.update((index) => Math.max(0, index - 1));
  }

  private keepAnswer(): void {
    const selected = this.selected();
    if (selected === undefined) return;
    const index = this.index();
    this.answers.update((answers) => {
      const copy = [...answers];
      copy[index] = selected;
      return copy;
    });
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
