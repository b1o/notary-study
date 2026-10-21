import { paginate, type MeasuredItem, type Page } from './sheet-pages';

/** A line is 10 px high in these tests. */
const LINE = 10;

function paragraph(lines: number, gap = LINE): MeasuredItem {
  return { gap, height: lines * LINE, lines, keepWithNext: false };
}

/** An item that cannot break, such as signatures or a stamp. */
function block(height: number, gap = LINE): MeasuredItem {
  return { gap, height, lines: 1, keepWithNext: false };
}

function keep(item: MeasuredItem): MeasuredItem {
  return { ...item, keepWithNext: true };
}

/** The pages as "item:from-to" pieces, which read better in a test. */
function layout(pages: readonly Page[]): string[][] {
  return pages.map((page) => page.map(({ item, from, to }) => `${item}:${from}-${to}`));
}

/** Pages of the same height. */
function pagesOf(items: readonly MeasuredItem[], height: number): string[][] {
  return layout(paginate(items, () => height));
}

describe('paginate', () => {
  it('puts a flow that fits on one page', () => {
    expect(pagesOf([paragraph(3, 0), paragraph(2)], 100)).toEqual([['0:0-3', '1:0-2']]);
  });

  it('drops the gap of an item that starts a page', () => {
    // 50 + 10 + 40 = 100 fills the page; the gap of the third item would not fit.
    expect(pagesOf([block(50, 0), block(40), block(80, 30)], 100)).toEqual([
      ['0:0-1', '1:0-1'],
      ['2:0-1'],
    ]);
  });

  it('breaks a paragraph between lines, with two lines on each side', () => {
    // 6 lines fit on the first page after a 30 px block: the paragraph of 10 lines breaks after 6.
    expect(pagesOf([block(30, 0), paragraph(10)], 100)).toEqual([['0:0-1', '1:0-6'], ['1:6-10']]);
  });

  it('leaves at least two lines at the top of the next page', () => {
    // 9 of 10 lines would fit; the break moves up so that two lines go to the next page.
    expect(pagesOf([paragraph(10, 0)], 90)).toEqual([['0:0-8'], ['0:8-10']]);
  });

  it('moves a paragraph to the next page when only one line of it fits', () => {
    expect(pagesOf([block(80, 0), paragraph(4)], 100)).toEqual([['0:0-1'], ['1:0-4']]);
  });

  it('keeps a heading with the first lines of its text', () => {
    // The heading fits, but no two lines of the text after it: both go to the next page.
    expect(pagesOf([block(70, 0), keep(block(10)), paragraph(4)], 100)).toEqual([
      ['0:0-1'],
      ['1:0-1', '2:0-4'],
    ]);
  });

  it('keeps the last lines of the text with the signatures and the stamp', () => {
    const flow = [paragraph(6, 0), keep(paragraph(4)), keep(block(30)), block(40)];

    // The signatures and the stamp do not fit after the text; the last two lines go with them.
    expect(pagesOf(flow, 120)).toEqual([
      ['0:0-6', '1:0-2'],
      ['1:2-4', '2:0-1', '3:0-1'],
    ]);
  });

  it('gives the first page its own height, for the boxes of a deed', () => {
    const pages = paginate([paragraph(10, 0)], (index) => (index === 0 ? 50 : 100));

    expect(layout(pages)).toEqual([['0:0-5'], ['0:5-10']]);
  });

  it('breaks where the page is full when no break follows the rules', () => {
    // A chain of items that keep together and do not fit on one page.
    const flow = [keep(block(60, 0)), keep(block(60)), block(10)];

    expect(pagesOf(flow, 100)).toEqual([['0:0-1'], ['1:0-1', '2:0-1']]);
  });

  it('puts an item taller than a page on a page of its own', () => {
    expect(pagesOf([block(20, 0), block(150), block(20)], 100)).toEqual([
      ['0:0-1'],
      ['1:0-1'],
      ['2:0-1'],
    ]);
  });
});
