import { gazetteIssue, inForceDate } from './act-dates';

describe('inForceDate', () => {
  it('reads the date of "В сила от"', () => {
    expect(inForceDate('В сила от 07.01.1997 г.')).toBe('1997-01-07');
    expect(inForceDate('15.08.1998 г.')).toBe('1998-08-15');
  });

  it('gives nothing for a note that is not a date of force', () => {
    expect(inForceDate('Издадена от министъра на правосъдието')).toBeUndefined();
    expect(inForceDate('Отразена деноминацията от 05.07.1999 г.')).toBeUndefined();
    expect(inForceDate(undefined)).toBeUndefined();
  });
});

describe('gazetteIssue', () => {
  it('reads an amendment with a Bulgarian month', () => {
    expect(gazetteIssue('изм. и доп. ДВ. бр.92 от 6 Октомври 2026г.')).toEqual({
      kind: 'changed',
      number: '92',
      date: '2026-10-06',
    });
  });

  it('reads a promulgation, and a date in figures', () => {
    expect(gazetteIssue('Обн. ДВ. бр.73 от 17 Септември 2010г.')).toEqual({
      kind: 'published',
      number: '73',
      date: '2010-09-17',
    });
    expect(gazetteIssue('изм. и доп. ДВ, бр. 39 от 26.05.2009 г., в сила от 1.07.2009 г.')).toEqual(
      { kind: 'changed', number: '39', date: '2009-05-26' },
    );
  });

  it('gives nothing for another note', () => {
    expect(gazetteIssue('Наредбата се прилага от деня на подписването')).toBeUndefined();
  });
});
