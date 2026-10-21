import {
  articleKey,
  findCitations,
  formatReference,
  parseCitationText,
  parseReference,
  toReferenceString,
  typedArticle,
} from './citation';

const CATALOG = [
  { id: 'znnd', abbr: 'ЗННД' },
  { id: 'zzd', abbr: 'ЗЗД' },
  { id: 'zzdet', abbr: 'ЗЗДет' },
  { id: 'gpk', abbr: 'ГПК' },
];

describe('parseReference', () => {
  it('reads act, article, paragraph and point', () => {
    expect(parseReference('znnd:25:9:2')).toEqual({
      act: 'znnd',
      article: '25',
      paragraph: '9',
      point: '2',
    });
  });

  it('leaves out the parts that are not there', () => {
    expect(parseReference('znnd:25')).toEqual({
      act: 'znnd',
      article: '25',
      paragraph: undefined,
      point: undefined,
    });
  });

  it('round-trips through toReferenceString', () => {
    expect(toReferenceString(parseReference('gpk:578:1'))).toBe('gpk:578:1');
  });
});

describe('articleKey', () => {
  it('ignores the paragraph', () => {
    expect(articleKey(parseReference('znnd:25:9'))).toBe(articleKey(parseReference('znnd:25:1')));
  });
});

describe('findCitations', () => {
  it('finds plain and labelled citations in order', () => {
    expect(findCitations('See [[znnd:25:9]] and [[gpk:578|the form rule]].')).toEqual([
      { ref: 'znnd:25:9', label: undefined },
      { ref: 'gpk:578', label: 'the form rule' },
    ]);
  });
});

describe('formatReference', () => {
  const znnd = { abbr: 'ЗННД' };

  it('uses the Bulgarian form', () => {
    expect(formatReference(parseReference('znnd:25:9:2'), znnd, 'bg')).toBe(
      'чл. 25, ал. 9, т. 2 ЗННД',
    );
  });

  it('uses the English form', () => {
    expect(formatReference(parseReference('znnd:25:9'), znnd, 'en')).toBe('Art. 25(9) ЗННД');
  });

  it('formats provisions with §', () => {
    expect(formatReference(parseReference('znnd:§1'), znnd, 'bg')).toBe('§ 1 ЗННД');
  });

  it('uses the unit of the act when it has one', () => {
    const tariff = { abbr: 'ТНТ', unit: { bg: 'т.', en: 'Item' } };
    expect(formatReference(parseReference('tarifa:7'), tariff, 'en')).toBe('Item 7 ТНТ');
  });

  it('falls back to the act id when the catalog has no entry', () => {
    expect(formatReference(parseReference('xyz:1'), undefined, 'bg')).toBe('чл. 1 xyz');
  });
});

describe('parseCitationText', () => {
  it('reads a Bulgarian citation', () => {
    expect(parseCitationText('чл. 25, ал. 9 ЗННД', CATALOG)).toEqual({
      act: 'znnd',
      article: '25',
      paragraph: '9',
    });
  });

  it('reads a short form', () => {
    expect(parseCitationText('ЗННД 25', CATALOG)).toMatchObject({ act: 'znnd', article: '25' });
  });

  it('prefers the longest abbreviation', () => {
    expect(parseCitationText('чл. 3 ЗЗДет', CATALOG)?.act).toBe('zzdet');
  });

  it('reads a provision', () => {
    expect(parseCitationText('§ 1 ЗННД', CATALOG)).toEqual({ act: 'znnd', article: '§1' });
  });

  it('returns undefined when no act is named', () => {
    expect(parseCitationText('чл. 25', CATALOG)).toBeUndefined();
  });

  it('reads a Latin letter after the number as the Cyrillic one', () => {
    expect(parseCitationText('Art. 28a(1) znnd', CATALOG)).toEqual({
      act: 'znnd',
      article: '28а',
      paragraph: '1',
    });
  });

  it('reads "пар." as a provision', () => {
    expect(parseCitationText('пар. 1 ЗННД', CATALOG)).toEqual({ act: 'znnd', article: '§1' });
  });

  it('reads the article when the paragraph comes first', () => {
    expect(parseCitationText('ал. 9 чл. 25 ЗННД', CATALOG)).toMatchObject({
      article: '25',
      paragraph: '9',
    });
  });

  it('reads "para." as the paragraph', () => {
    expect(parseCitationText('Art. 25 para. 9 ЗННД', CATALOG)?.paragraph).toBe('9');
  });

  it('finds an act whose abbreviation has "№" without it', () => {
    const catalog = [...CATALOG, { id: 'n32', abbr: 'Наредба № 32' }];
    expect(parseCitationText('Наредба 32, чл. 9а', catalog)).toMatchObject({
      act: 'n32',
      article: '9а',
    });
  });
});

describe('typedArticle', () => {
  it('reads a number with or without its mark', () => {
    expect(typedArticle('25')).toBe('25');
    expect(typedArticle('чл. 28а')).toBe('28а');
    expect(typedArticle('Art. 28a')).toBe('28а');
    expect(typedArticle('§ 1')).toBe('§1');
  });

  it('gives nothing for a word', () => {
    expect(typedArticle('нотариус')).toBeUndefined();
    expect(typedArticle('25 дни')).toBeUndefined();
  });
});
