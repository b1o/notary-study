import {
  articleKey,
  findCitations,
  formatReference,
  parseCitationText,
  parseReference,
  toReferenceString,
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
});
