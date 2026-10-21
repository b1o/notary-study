import { findMatches, queryWords, searchText, snippet, type Searchable } from './search';

const item = (text: string, title = ''): Searchable & { id: string } => ({
  id: text,
  texts: [searchText('bg', text, title)],
});

describe('queryWords', () => {
  it('folds the words and drops one-letter words', () => {
    expect(queryWords('  Нотариален  АКТ и ')).toEqual(['нотариален', 'акт']);
  });

  it('keeps a one-letter query as one word', () => {
    expect(queryWords('a')).toEqual(['a']);
    expect(queryWords('  ')).toEqual([]);
  });
});

describe('findMatches', () => {
  const items = [
    item('Сделката е нищожна, ако актът не е нотариален.'),
    item('Нотариален акт за собственост върху имот.'),
    item('Договорът за продажба на имот.', 'Нотариален акт'),
    item('Пълномощно с нотариална заверка.'),
  ];

  it('finds the items that contain every word, in any order', () => {
    const result = findMatches(items, 'акт нотариален', 10);
    expect(result.total).toBe(3);
  });

  it('ranks the whole query in the title first, then in the text', () => {
    const ids = findMatches(items, 'нотариален акт', 10).matches.map((match) => match.item.id);
    expect(ids).toEqual([items[2].id, items[1].id, items[0].id]);
  });

  it('stops at the limit and gives the total', () => {
    const result = findMatches(items, 'нотариал', 2);
    expect(result.matches.length).toBe(2);
    expect(result.total).toBe(4);
  });

  it('uses the text with the best rank, for example the translation', () => {
    const article: Searchable = {
      texts: [
        searchText('bg', 'Нотариусът удостоверява.'),
        searchText('en', 'The notary certifies.'),
      ],
    };
    expect(findMatches([article], 'notary', 5).matches[0].snippet.language).toBe('en');
  });

  it('finds nothing for an empty query', () => {
    expect(findMatches(items, ' ', 5)).toEqual({ matches: [], total: 0 });
  });
});

describe('snippet', () => {
  const long = `${'дума '.repeat(40)}Нотариален акт ${'край '.repeat(40)}`.trim();

  it('marks the match in the original letters and cuts between words', () => {
    const result = snippet(searchText('bg', long), ['нотариален'], 'нотариален акт');
    expect(result.match).toBe('Нотариален акт');
    expect(result.before.startsWith('…дума')).toBe(true);
    expect(result.after.endsWith('край…')).toBe(true);
  });

  it('shows the start of the text when only the title matches', () => {
    const result = snippet(searchText('bg', 'Кратък текст.', 'Заглавие'), ['заглавие'], 'заглавие');
    expect(result).toMatchObject({ before: 'Кратък текст.', match: '', after: '' });
  });
});
