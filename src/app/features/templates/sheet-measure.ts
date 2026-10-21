/**
 * Measures of the hidden flow of a sheet, at the real size of the paper. They only read the layout;
 * core/reference/sheet-pages.ts decides the page breaks from them.
 */

import type { FlowItem } from '../../core/reference/sheet-flow';
import type { MeasuredItem } from '../../core/reference/sheet-pages';

/** The measures of the items of a flow, from their elements (one `.sheet__item` each). */
export function measureItems(
  elements: readonly HTMLElement[],
  flow: readonly FlowItem[],
): MeasuredItem[] {
  return elements.map((element, index) => {
    const item = flow[index];
    const gap = parseFloat(getComputedStyle(element).paddingBlockStart) || 0;
    const height = element.getBoundingClientRect().height - gap;
    const paragraph = item.breakable ? paragraphOf(element) : null;
    const lineHeight = paragraph ? parseFloat(getComputedStyle(paragraph).lineHeight) : NaN;
    const lines = lineHeight > 0 ? Math.max(1, Math.round(height / lineHeight)) : 1;
    return { gap, height, lines, keepWithNext: item.keepWithNext };
  });
}

/** The height inside the padding of an element: the room for the text of a page. */
export function contentHeight(element: HTMLElement): number {
  const style = getComputedStyle(element);
  return (
    element.clientHeight -
    (parseFloat(style.paddingBlockStart) || 0) -
    (parseFloat(style.paddingBlockEnd) || 0)
  );
}

/**
 * The position (sheet-line.ts) of the first piece on line `line` of the paragraph in an item. Every
 * visible piece of the paragraph carries its position in `data-at`; the pieces are in reading order,
 * so a binary search finds the first one below the top of the line.
 */
export function lineStart(item: HTMLElement, line: number, fallback: number): number {
  const paragraph = paragraphOf(item);
  if (!paragraph || line <= 0) return line <= 0 ? 0 : fallback;
  const probes = probesOf(paragraph);
  const lineHeight = parseFloat(getComputedStyle(paragraph).lineHeight);
  const top = paragraph.getBoundingClientRect().top + line * lineHeight;
  let low = 0;
  let high = probes.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    const rect = probes[middle].rect();
    if (rect.top + rect.height / 2 < top) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return probes[low]?.at ?? fallback;
}

interface Probe {
  readonly at: number;
  readonly rect: () => DOMRect;
}

function paragraphOf(item: HTMLElement): HTMLElement | null {
  return item.querySelector('p');
}

/** One probe for each character of the text and for each box or piece of a dotted line. */
function probesOf(paragraph: HTMLElement): Probe[] {
  const range = paragraph.ownerDocument.createRange();
  return [...paragraph.querySelectorAll<HTMLElement>('[data-at]')].flatMap((element) => {
    const at = Number(element.dataset['at']);
    if (!element.classList.contains('sheet__text')) {
      return [{ at, rect: () => element.getBoundingClientRect() }];
    }
    const probes: Probe[] = [];
    let offset = 0;
    for (const node of element.childNodes) {
      if (!(node instanceof Text)) continue;
      for (let index = 0; index < node.length; index++) {
        const position = at + offset + index;
        probes.push({
          at: position,
          rect: () => {
            range.setStart(node, index);
            range.setEnd(node, index + 1);
            return range.getBoundingClientRect();
          },
        });
      }
      offset += node.length;
    }
    return probes;
  });
}
