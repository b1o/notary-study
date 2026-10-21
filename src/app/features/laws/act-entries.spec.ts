import type { LawArticle } from '../../core/laws/law.models';
import { matchesQuery, toEntries } from './act-entries';

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

describe('matchesQuery', () => {
  it('matches the article number, with or without "чл."', () => {
    expect(matchesQuery(ARTICLE, {}, '25')).toBe(true);
    expect(matchesQuery(ARTICLE, {}, 'чл. 25')).toBe(true);
    expect(matchesQuery(ARTICLE, {}, '26')).toBe(false);
  });

  it('matches a word of the title, the text or the translation', () => {
    expect(matchesQuery(ARTICLE, {}, 'интересите')).toBe(true);
    const translation = {
      '25': { paragraphs: ['Art. 25. (1) The notary must protect the parties.'] },
    };
    expect(matchesQuery(ARTICLE, translation, 'protect')).toBe(true);
  });
});
