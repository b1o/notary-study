import { plainHeading, slugify, SlugRegistry } from './slug';

describe('plainHeading', () => {
  it('removes citations, term marks and emphasis', () => {
    expect(plainHeading('The **draft** of a {{нотариален акт}} [[gpk:578]]')).toBe(
      'The draft of a нотариален акт',
    );
  });
});

describe('slugify', () => {
  it('keeps Latin and Cyrillic letters and digits', () => {
    expect(slugify('Проектът на акта, стъпка 1')).toBe('проектът-на-акта-стъпка-1');
  });

  it('gives a fallback for a heading without letters', () => {
    expect(slugify('***')).toBe('section');
  });
});

describe('SlugRegistry', () => {
  it('numbers repeated headings', () => {
    const slugs = new SlugRegistry();
    expect([slugs.next('Costs'), slugs.next('Costs'), slugs.next('Costs')]).toEqual([
      'costs',
      'costs-2',
      'costs-3',
    ]);
  });
});
