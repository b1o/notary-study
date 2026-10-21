import {
  filterItems,
  findMatches,
  queryTerms,
  queryWords,
  searchText,
  snippet,
  type Searchable,
} from './search';

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

  it('finds the other forms of a word', () => {
    const forms = [
      item('Издава се нотариалния акт.'),
      item('С нотариалната заверка.'),
      item('Нотариални действия.'),
    ];
    expect(findMatches(forms, 'нотариален', 10).total).toBe(3);
  });

  it('ranks the word as typed first, then another form, then the letters inside a word', () => {
    const ranked = [
      item('Лицето е ненотариално.'),
      item('Издава се нотариалния акт.'),
      item('Документът е нотариален.'),
    ];
    const ids = findMatches(ranked, 'нотариален', 10).matches.map((match) => match.item.id);
    expect(ids).toEqual([ranked[2].id, ranked[1].id]);
    expect(findMatches(ranked, 'нотариал', 10).total).toBe(3);
  });

  it('finds a number only as a whole word', () => {
    const numbers = [item('Срокът по чл. 28 е кратък.'), item('Виж чл. 128.'), item('Чл. 28а.')];
    expect(findMatches(numbers, 'чл. 28', 5).matches.map((match) => match.item)).toEqual([
      numbers[0],
    ]);
  });

  it('marks another form of the word in the snippet', () => {
    const [match] = findMatches(
      [item('Пред нотариуса се явиха страните.')],
      'нотариуси',
      5,
    ).matches;
    expect(match.snippet.match).toBe('нотариуса');
  });
});

describe('filterItems', () => {
  it('keeps the items with every word in any form, in their own order', () => {
    const terms = [item('Дарение между съпрузите.'), item('Наем.'), item('Дарението на съпруг.')];
    expect(filterItems(terms, 'съпруг дарение')).toEqual([terms[0], terms[2]]);
  });

  it('keeps every item for an empty query', () => {
    expect(filterItems([item('а'), item('б')], '  ').length).toBe(2);
  });
});

describe('snippet', () => {
  const long = `${'дума '.repeat(40)}Нотариален акт ${'край '.repeat(40)}`.trim();

  it('marks the match in the original letters and cuts between words', () => {
    const result = snippet(searchText('bg', long), queryTerms('нотариален'), 'нотариален акт');
    expect(result.match).toBe('Нотариален акт');
    expect(result.before.startsWith('…дума')).toBe(true);
    expect(result.after.endsWith('край…')).toBe(true);
  });

  it('shows the start of the text when only the title matches', () => {
    const result = snippet(
      searchText('bg', 'Кратък текст.', 'Заглавие'),
      queryTerms('заглавие'),
      'заглавие',
    );
    expect(result).toMatchObject({ before: 'Кратък текст.', match: '', after: '' });
  });
});
