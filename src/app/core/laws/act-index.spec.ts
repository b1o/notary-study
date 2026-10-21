import { indexAct } from './act-index';
import type { LawAct, LawItem } from './law.models';

const article = (number: string): LawItem => ({
  kind: 'article',
  number,
  paragraphs: [`Чл. ${number}. Текст.`],
});

const ACT = {
  id: 'test',
  items: [
    { kind: 'heading', level: 1, text: 'Глава първа' },
    article('1'),
    { kind: 'heading', level: 2, text: 'Раздел I' },
    article('2'),
    article('3'),
    { kind: 'heading', level: 2, text: 'Раздел II' },
    article('4'),
    { kind: 'heading', level: 1, text: 'Глава втора' },
    article('5'),
  ],
} as unknown as LawAct;

describe('indexAct', () => {
  const index = indexAct(ACT);

  it('lists the articles in order', () => {
    expect(index.articles.map((item) => item.number)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('gives the heading path, outermost first', () => {
    expect(index.context('3')?.path.map((heading) => heading.text)).toEqual([
      'Глава първа',
      'Раздел I',
    ]);
  });

  it('starts a new path at a new chapter', () => {
    expect(index.context('5')?.path.map((heading) => heading.text)).toEqual(['Глава втора']);
  });

  it('gives the neighbours across sections', () => {
    const context = index.context('4');
    expect([context?.previous?.number, context?.next?.number]).toEqual(['3', '5']);
  });

  it('gives the articles of the same section', () => {
    expect(index.context('2')?.section.map((item) => item.number)).toEqual(['2', '3']);
  });

  it('returns undefined for an unknown article', () => {
    expect(index.context('99')).toBeUndefined();
  });
});
