import {
  entryFee,
  item10Fee,
  item12Fee,
  item5Fee,
  item6Fee,
  item8Fee,
  item9Fee,
  toEuro,
} from './tariff';

describe('item8Fee', () => {
  // The upper end of each bracket in the tariff table, and the fee it gives.
  it.each([
    [100, 30],
    [1_000, 43.5],
    [10_000, 160.5],
    [50_000, 480.5],
    [100_000, 730.5],
    [500_000, 1530.5],
  ])('gives the table value at %i лв.', (interest, fee) => {
    expect(item8Fee(interest)).toBeCloseTo(fee, 6);
  });

  it('adds the percentage of each bracket above its start', () => {
    expect(item8Fee(200_000)).toBeCloseTo(730.5 + 0.002 * 100_000, 6);
  });

  it('stops at 6000 лв.', () => {
    expect(item8Fee(10_000_000)).toBe(6_000);
  });
});

describe('items 9, 10 and 12', () => {
  it('apply their share of item 8 with a minimum', () => {
    expect(item9Fee(100_000)).toBeCloseTo(365.25, 6);
    expect(item9Fee(50)).toBe(30);
    expect(item10Fee(100_000)).toBeCloseTo(219.15, 6);
    expect(item10Fee(50)).toBe(30);
    expect(item12Fee(100_000)).toBeCloseTo(109.575, 6);
    expect(item12Fee(50)).toBe(25);
  });
});

describe('item5Fee', () => {
  it('charges 5 лв. for the first signature and 2 лв. for each next one', () => {
    expect(item5Fee(1, false, false)).toBe(5);
    expect(item5Fee(3, false, false)).toBe(9);
  });

  it('doubles the fee per signature for a re-delegation', () => {
    expect(item5Fee(1, false, true)).toBe(10);
  });

  it('charges 10 лв. per signature for rights over real estate, 20 лв. for a re-delegation', () => {
    expect(item5Fee(2, true, false)).toBe(20);
    expect(item5Fee(2, true, true)).toBe(40);
  });
});

describe('item6Fee', () => {
  it('charges 3 лв. for the first page and 2 лв. for each next page, per copy', () => {
    expect(item6Fee(3, 2)).toBe(2 * (3 + 2 + 2));
  });
});

describe('entryFee and toEuro', () => {
  it('charges 0.1% with a minimum of 10 лв.', () => {
    expect(entryFee(1_000)).toBe(10);
    expect(entryFee(300_000)).toBe(300);
  });

  it('converts at 1.95583 and rounds to cents', () => {
    expect(toEuro(10)).toBe(5.11);
  });
});
