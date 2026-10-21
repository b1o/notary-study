import type { QuizQuestion } from '../content/content.models';

/** Percent of right answers needed to pass a chapter test. */
export const CHAPTER_PASS_MARK = 80;
/** Percent of right answers needed to pass the final exam. */
export const EXAM_PASS_MARK = 75;
/** Number of questions in the final exam. */
export const EXAM_SIZE = 40;

/** A question ready to ask: the options in a random order, and the index of the right one. */
export interface QuizItem {
  readonly question: string;
  readonly options: readonly string[];
  readonly answer: number;
  readonly explanation: string;
  readonly refs: readonly string[];
  readonly chapterId: string;
}

/** A copy of the items in a random order (Fisher–Yates). */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Shuffle the options of a question and remember where the right answer went. */
export function prepareQuestion(
  question: QuizQuestion,
  chapterId: string,
  random: () => number = Math.random,
): QuizItem {
  const order = shuffle(
    question.options.map((_, index) => index),
    random,
  );
  return {
    question: question.question,
    options: order.map((index) => question.options[index]),
    answer: order.indexOf(question.answer),
    explanation: question.explanation,
    refs: question.refs,
    chapterId,
  };
}

/** The questions of one chapter test, in a random order. */
export function chapterTest(
  chapterId: string,
  questions: readonly QuizQuestion[],
  random: () => number = Math.random,
): QuizItem[] {
  return shuffle(questions, random).map((question) => prepareQuestion(question, chapterId, random));
}

/** The final exam: `size` random questions from all chapters. */
export function finalExam(
  chapters: readonly { readonly chapterId: string; readonly quiz: readonly QuizQuestion[] }[],
  size = EXAM_SIZE,
  random: () => number = Math.random,
): QuizItem[] {
  const pool = chapters.flatMap(({ chapterId, quiz }) =>
    quiz.map((question) => ({ chapterId, question })),
  );
  return shuffle(pool, random)
    .slice(0, size)
    .map(({ chapterId, question }) => prepareQuestion(question, chapterId, random));
}

/** Percent of right answers, rounded: `answers[i]` is the option chosen for `items[i]`. */
export function scorePercent(items: readonly QuizItem[], answers: readonly number[]): number {
  if (!items.length) return 0;
  const right = items.filter((item, i) => answers[i] === item.answer).length;
  return Math.round((right / items.length) * 100);
}
