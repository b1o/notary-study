import type { QuizQuestion } from '../content/content.models';
import { finalExam, prepareQuestion, scorePercent, shuffle } from './quiz';

const QUESTION: QuizQuestion = {
  question: 'How many copies?',
  options: ['Five', 'One', 'Two', 'Three'],
  answer: 0,
  explanation: 'At least five.',
  refs: ['n32:18:1'],
};

/** A fixed sequence instead of Math.random, so the tests know the order. */
const sequence = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('shuffle', () => {
  it('keeps every item exactly once', () => {
    expect(shuffle([1, 2, 3, 4, 5]).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not change its input', () => {
    const items = [1, 2, 3];
    shuffle(items, sequence(0));
    expect(items).toEqual([1, 2, 3]);
  });
});

describe('prepareQuestion', () => {
  it('follows the right answer to its new place', () => {
    const item = prepareQuestion(QUESTION, 'deeds', sequence(0, 0, 0));
    expect(item.options[item.answer]).toBe('Five');
    expect(item.chapterId).toBe('deeds');
  });
});

describe('finalExam', () => {
  it('takes the requested number of questions from all chapters', () => {
    const chapters = [
      { chapterId: 'a', quiz: [QUESTION, QUESTION] },
      { chapterId: 'b', quiz: [QUESTION, QUESTION, QUESTION] },
    ];
    expect(finalExam(chapters, 4)).toHaveLength(4);
    expect(finalExam(chapters, 40)).toHaveLength(5);
  });
});

describe('scorePercent', () => {
  it('rounds the share of right answers', () => {
    const items = [0, 1, 2].map(() => prepareQuestion(QUESTION, 'a', sequence(0.99)));
    const right = items[0].answer;
    expect(scorePercent(items, [right, right, (right + 1) % 4])).toBe(67);
  });

  it('is 0 for an empty test', () => {
    expect(scorePercent([], [])).toBe(0);
  });
});
