import type { LawAct, LawArticle } from '../../core/laws/law.models';
import { lawDocuments } from '../../core/search/search-index';
import { filterArticles, toEntries } from './act-entries';

const ARTICLE: LawArticle = {
  kind: 'article',
  number: '25',
  title: 'Опазване правата и интересите на страните',
  paragraphs: ['Чл. 25. (1) Нотариусът е длъжен да опазва правата на страните.'],
};

describe('toEntries', () => {
  const entries = toEntries([
    { kind: 'heading', level: 1, text: 'Глава втора. НОТАРИУС' },
    { kind: 'heading', level: 2, text: 'Раздел I. Общи положения' },
    ARTICLE,
  ]);

  it('links a heading by its position and splits its text', () => {
    expect(entries[0]).toMatchObject({
      kind: 'heading',
      id: 'h-0',
      parts: { label: 'Глава втора' },
    });
  });

  it('links an article by its number, with a header one level below the heading above it', () => {
    expect(entries[2]).toMatchObject({ kind: 'article', id: 'art-25', headingLevel: 4 });
  });
});

describe('filterArticles', () => {
  const act: LawAct = {
    id: 'znnd',
    abbr: 'ЗННД',
    title: { bg: 'Закон за нотариусите и нотариалната дейност', en: 'Notaries Act' },
    group: 'notary',
    source: 'https://lex.bg',
    retrieved: '2026-10-01',
    partial: false,
    articles: 2,
    items: [ARTICLE, { kind: 'article', number: '28а', paragraphs: ['Чл. 28а. Срокът е 7 дни.'] }],
  };
  const translation = {
    '25': { paragraphs: ['Art. 25. (1) The notary must protect the parties.'] },
  };
  const documents = lawDocuments(act, translation);

  it('keeps the article that the query names by its number', () => {
    expect([...filterArticles(documents, '25')]).toEqual(['25']);
    expect([...filterArticles(documents, 'чл. 25')]).toEqual(['25']);
    expect([...filterArticles(documents, '28a')]).toEqual(['28а']);
    expect([...filterArticles(documents, '26')]).toEqual([]);
  });

  it('keeps the articles with a word of the title, the text or the translation, in any form', () => {
    expect(filterArticles(documents, 'интересите').has('25')).toBe(true);
    expect(filterArticles(documents, 'нотариуса').has('25')).toBe(true);
    expect(filterArticles(documents, 'protects').has('25')).toBe(true);
  });
});
