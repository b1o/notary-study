import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

import type { DocumentForm, NotarySeal, Paper } from '../../core/content/content.models';
import { LanguageService } from '../../core/i18n/language.service';
import { documentLayout, parseLine } from '../../core/reference/document-layout';
import { sheetFlow, type FlowItem, type SheetBlock } from '../../core/reference/sheet-flow';
import { sheetLine, sliceLine } from '../../core/reference/sheet-line';
import { paginate, type MeasuredItem, type PagePiece } from '../../core/reference/sheet-pages';
import { elementWidth } from '../../shared/dom/element-size';
import { NotarySealMark } from './notary-seal';
import { contentHeight, lineStart, measureItems } from './sheet-measure';
import { SheetSignatures } from './sheet-signatures';
import { SheetText } from './sheet-text';

/** 12 pt, the size of the text on the paper, in CSS pixels. */
const PAPER_TEXT_PX = 16;

/** One piece of an item on a page: a whole item, or some lines of a paragraph. */
interface PieceView {
  readonly block: SheetBlock;
  /** An empty line before the piece: it does not start the page. */
  readonly gap: boolean;
  /** The paragraph began on the page before. */
  readonly continued: boolean;
  /** The paragraph goes on to the next page. */
  readonly continues: boolean;
}

let nextSheet = 0;

/**
 * A template set like the paper document, page by page (docs/research/templates/decisions.md):
 * A4 pages with the margins for binding, the boxes and the frame of a notarial deed, the
 * signatures with the seal of the notary, and the certifications as stamps.
 *
 * The sheet first lays out the whole text in a hidden page at the real size of the paper,
 * measures it, and lets core/reference/sheet-pages.ts break it into pages. The visible pages
 * show those pages: at the reader's text size when a page fits the column, or with the text
 * flowing in the width of a narrow screen. Print always gives the real pages.
 */
@Component({
  selector: 'nc-document-sheet',
  imports: [NgTemplateOutlet, NotarySealMark, SheetSignatures, SheetText],
  templateUrl: './document-sheet.html',
  styleUrl: './document-sheet.scss',
})
export class DocumentSheet {
  readonly text = input.required<string>();
  /** The printed form, for a notarial deed: the fee box, the entry box and the frame. */
  readonly form = input<DocumentForm>();
  readonly seal = input<NotarySeal>();
  readonly paper = input<Paper>('a4');

  protected readonly ui = inject(LanguageService).text;
  /** The start of the ids in this sheet, apart for each sheet. */
  protected readonly id = `sheet-${nextSheet++}`;

  protected readonly flow = computed(() => sheetFlow(documentLayout(this.text())));
  protected readonly boxes = computed(() =>
    (this.form()?.boxes ?? []).map((box) => ({
      title: box.title,
      lines: box.lines.map((line) => sheetLine(parseLine(line))),
    })),
  );
  /** Both sides of the sheet (Ordinance No. 32 Art. 19(1)): an even page is the back. */
  protected readonly twoSided = computed(() => this.paper() === 'a4');

  /** The pages, after the hidden page measured the text; empty before that. */
  protected readonly pages = signal<readonly (readonly PieceView[])[]>([]);
  /** The width of a page at its real size, in CSS pixels. */
  private readonly pageWidth = signal(0);
  /** Changes when the fonts finish loading, so that the sheet measures again. */
  private readonly fontLoads = signal(0);

  private readonly width = elementWidth(inject(ElementRef).nativeElement);
  /** The size of 1em of the reader's text size, in CSS pixels. */
  private readonly emSize = signal(PAPER_TEXT_PX);

  private readonly em = viewChild.required<ElementRef<HTMLElement>>('em');
  private readonly firstText = viewChild.required<ElementRef<HTMLElement>>('firstText');
  private readonly nextText = viewChild.required<ElementRef<HTMLElement>>('nextText');
  private readonly measured = viewChildren<ElementRef<HTMLElement>>('measuredItem');

  /**
   * The size of the pages on screen: the reader's text size (the paper has 12 pt), but not wider
   * than the column. Below 1 the text would be smaller than on paper; the sheet flows instead.
   */
  protected readonly scale = computed(() => {
    const page = this.pageWidth();
    const reading = this.emSize() / PAPER_TEXT_PX;
    return page ? Math.min(reading, this.width() / page) : 1;
  });
  protected readonly flowing = computed(() => this.scale() < 1);

  constructor() {
    const fonts = inject(DOCUMENT).fonts;
    const fontLoaded = () => this.fontLoads.update((count) => count + 1);
    fonts.addEventListener('loadingdone', fontLoaded);
    inject(DestroyRef).onDestroy(() => fonts.removeEventListener('loadingdone', fontLoaded));
    afterNextRender(() => void fonts.ready.then(fontLoaded));

    // The reader's text size: the width of an element of 1em, followed when the view renews it.
    // A width of 0 means that the element has left the page.
    afterRenderEffect({
      read: (onCleanup) => {
        const observer = new ResizeObserver(([entry]) => {
          const size = entry.borderBoxSize[0].inlineSize;
          if (size > 0) this.emSize.set(size);
        });
        observer.observe(this.em().nativeElement);
        onCleanup(() => observer.disconnect());
      },
    });
    afterRenderEffect({ read: () => this.measure() });
  }

  private measure(): void {
    this.fontLoads();
    const flow = this.flow();
    const elements = this.measured().map((ref) => ref.nativeElement);
    if (elements.length !== flow.length) return;
    const items = measureItems(elements, flow);
    const first = contentHeight(this.firstText().nativeElement);
    const next = contentHeight(this.nextText().nativeElement);
    const pages = paginate(items, (index) => (index === 0 ? first : next));
    const page = this.firstText().nativeElement.closest('.sheet-page');
    this.pageWidth.set(page?.getBoundingClientRect().width ?? 0);
    this.pages.set(
      pages.map((pieces) =>
        pieces.map((piece, index) =>
          pieceView(piece, index, flow[piece.item], items[piece.item], elements[piece.item]),
        ),
      ),
    );
  }
}

/** A piece for the page; a paragraph cut by a page break gets the lines of the piece. */
function pieceView(
  piece: PagePiece,
  index: number,
  item: FlowItem,
  measure: MeasuredItem,
  element: HTMLElement,
): PieceView {
  const continued = piece.from > 0;
  const continues = piece.to < measure.lines;
  let block = item.block;
  if (block.kind === 'paragraph' && (continued || continues)) {
    const { line } = block;
    const from = lineStart(element, piece.from, 0);
    const to = continues ? lineStart(element, piece.to, line.length) : line.length;
    block = { kind: 'paragraph', line: sliceLine(line, from, to) };
  }
  return { block, gap: index > 0 && item.gap && !continued, continued, continues };
}
