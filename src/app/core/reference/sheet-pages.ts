/**
 * Page breaks for a measured flow (sheet-flow.ts). The page measures each item at the real size of
 * the paper; this file decides where the pages break:
 * - never inside a line or inside an item that cannot break (signatures, a stamp, a heading);
 * - inside a paragraph only between lines, with at least ORPHANS lines at the bottom of the page and
 *   WIDOWS lines at the top of the next page;
 * - never between an item that keeps with the next item and that item.
 * When no break on a page follows the rules, the page breaks where it is full.
 */

export interface MeasuredItem {
  /** The space above the item. A page drops it when the item starts the page. */
  readonly gap: number;
  /** The height of the item without the gap. */
  readonly height: number;
  /** The number of lines of a paragraph that can break; 1 for an item that cannot break. */
  readonly lines: number;
  readonly keepWithNext: boolean;
}

/** The lines `from` up to (not including) `to` of one item. An item that cannot break has one line. */
export interface PagePiece {
  readonly item: number;
  readonly from: number;
  readonly to: number;
}

export type Page = readonly PagePiece[];

/** Lines of a paragraph at least at the bottom of a page, and at least at the top of the next. */
export const ORPHANS = 2;
export const WIDOWS = 2;

/** Rounding of measured sizes, in CSS pixels. */
const TOLERANCE = 0.5;

interface Unit {
  readonly item: number;
  readonly line: number;
  readonly height: number;
}

/**
 * The pages of a flow.
 *
 * @param capacity the height of the text area of page `index` (0 is the first page)
 */
export function paginate(
  items: readonly MeasuredItem[],
  capacity: (index: number) => number,
): Page[] {
  const units = items.flatMap((item, index) =>
    Array.from({ length: Math.max(1, item.lines) }, (_, line) => ({
      item: index,
      line,
      height: item.height / Math.max(1, item.lines),
    })),
  );
  const canBreakBefore = (at: number): boolean => {
    const unit = units[at];
    if (unit.line === 0) return !items[unit.item - 1]?.keepWithNext;
    const { lines } = items[unit.item];
    return unit.line >= ORPHANS && lines - unit.line >= WIDOWS;
  };

  const pages: Page[] = [];
  let start = 0;
  while (start < units.length) {
    const room = capacity(pages.length) + TOLERANCE;
    let used = 0;
    let end = start;
    while (end < units.length) {
      const unit = units[end];
      const gap = end > start && unit.line === 0 ? items[unit.item].gap : 0;
      if (end > start && used + gap + unit.height > room) break;
      used += gap + unit.height;
      end++;
    }
    let next = end;
    if (end < units.length) {
      let at = end;
      while (at > start && !canBreakBefore(at)) at--;
      // No break on this page follows the rules: break where the page is full.
      next = at > start ? at : end;
    }
    pages.push(pieces(units.slice(start, next)));
    start = next;
  }
  return pages;
}

/** The units of a page as pieces of items. */
function pieces(units: readonly Unit[]): PagePiece[] {
  const result: PagePiece[] = [];
  for (const unit of units) {
    const last = result[result.length - 1];
    if (last?.item === unit.item) {
      result[result.length - 1] = { ...last, to: unit.line + 1 };
    } else {
      result.push({ item: unit.item, from: unit.line, to: unit.line + 1 });
    }
  }
  return result;
}
