/**
 * The flow of a template on its pages: the blocks in reading order, with the rules for page breaks
 * (docs/research/templates/decisions.md). sheet-pages.ts puts the measured flow on pages.
 */

import { blankSize } from './blank-size';
import {
  lineText,
  type DocumentBlock,
  type DocumentLayout,
  type Line,
  type Signer,
} from './document-layout';
import { sheetLine, sheetText, type SheetLine } from './sheet-line';

/** A line for the full name written by hand (ГПК Art. 579(1)), with its caption under it. */
export interface Handwriting {
  readonly caption: string;
  /** The length of the line, in characters of the page font. */
  readonly size: number;
}

export interface SheetSigner {
  readonly role: SheetLine | null;
  /** The number of signature lines: two spouses who donate together sign twice. */
  readonly lines: number;
  readonly note: SheetLine | null;
  readonly handwriting: Handwriting | null;
  /** The notary signs with the seal (Ordinance No. 32 Art. 19(1)). */
  readonly seal: boolean;
}

export interface SheetRow {
  readonly place: SheetLine | null;
  readonly signers: readonly SheetSigner[];
}

export type SheetBlock =
  | { readonly kind: 'title'; readonly title: SheetLine; readonly subtitle: readonly SheetLine[] }
  | { readonly kind: 'register'; readonly line: SheetLine }
  | { readonly kind: 'heading'; readonly line: SheetLine }
  | { readonly kind: 'paragraph'; readonly line: SheetLine }
  | { readonly kind: 'signatures'; readonly rows: readonly SheetRow[] }
  /**
   * A certification of the notary (Ordinance No. 32 Appendix 6): its text and the notary. The seal
   * of the notary goes beside the stamp, not in it, so `seal` is true and no signer in it has one.
   */
  | { readonly kind: 'stamp'; readonly blocks: readonly SheetBlock[]; readonly seal: boolean };

export interface FlowItem {
  readonly block: SheetBlock;
  /** An empty line comes before the item, unless the item starts a page. */
  readonly gap: boolean;
  /** The item stays on the page of the next item. */
  readonly keepWithNext: boolean;
  /** A page can break between the lines of the item. Only a paragraph can. */
  readonly breakable: boolean;
}

/** The items of a template, in reading order: the text, then the stamps. */
export function sheetFlow(layout: DocumentLayout): FlowItem[] {
  const placed = [
    ...layout.body.flatMap(items),
    ...layout.stamps.map((stamp) => ({ block: stampBlock(stamp), gap: true })),
  ];
  return placed.map(({ block, gap }, index) => ({
    block,
    gap: index > 0 && gap,
    keepWithNext: keepsWithNext(block, placed[index + 1]?.block),
    breakable: block.kind === 'paragraph',
  }));
}

/** The items of one block: a text block gives one paragraph for each line. */
function items(block: DocumentBlock): { block: SheetBlock; gap: boolean }[] {
  switch (block.kind) {
    case 'title':
      return [
        {
          block: {
            kind: 'title',
            title: sheetLine(block.title),
            subtitle: block.subtitle.map(sheetLine),
          },
          gap: block.gap,
        },
      ];
    case 'register':
    case 'heading':
      return [{ block: { kind: block.kind, line: sheetLine(block.line) }, gap: block.gap }];
    case 'text':
      return block.lines.map((line, index) => ({
        block: { kind: 'paragraph', line: sheetLine(line) },
        gap: block.gap && index === 0,
      }));
    case 'signatures':
      return [
        {
          block: {
            kind: 'signatures',
            rows: block.rows.map((row) => ({
              place: row.place && sheetLine(row.place),
              signers: row.signers.map(sheetSigner),
            })),
          },
          gap: block.gap,
        },
      ];
  }
}

/** A stamp, with the seal of its notary taken out of the signature row and put beside the stamp. */
function stampBlock(stamp: readonly DocumentBlock[]): SheetBlock {
  const blocks = stamp.flatMap(items).map((item) => item.block);
  const sealed = blocks.some(
    (block) =>
      block.kind === 'signatures' &&
      block.rows.some((row) => row.signers.some((signer) => signer.seal)),
  );
  return {
    kind: 'stamp',
    seal: sealed,
    blocks: blocks.map((block) =>
      block.kind === 'signatures'
        ? {
            ...block,
            rows: block.rows.map((row) => ({
              ...row,
              signers: row.signers.map((signer) => ({ ...signer, seal: false })),
            })),
          }
        : block,
    ),
  };
}

/**
 * The rules that keep blocks together:
 * - a title, the register line and a heading stay with the text after them;
 * - a line that ends with ":" stays with what it introduces;
 * - the last text, the signatures, the stamps and the seal stay on one page
 *   (Ordinance No. 32 Art. 19(1)).
 */
function keepsWithNext(block: SheetBlock, next: SheetBlock | undefined): boolean {
  if (!next) return false;
  switch (block.kind) {
    case 'title':
    case 'register':
    case 'heading':
      return true;
    case 'paragraph':
      return sheetText(block.line.parts).trimEnd().endsWith(':') || next.kind === 'signatures';
    case 'signatures':
      return next.kind === 'signatures' || next.kind === 'stamp';
    case 'stamp':
      return next.kind === 'stamp';
  }
}

/** A note that is one blank, "([собственоръчно изписани три имена])", is a line to write on. */
function sheetSigner(signer: Signer): SheetSigner {
  const handwriting = signer.note && handwritingOf(signer.note);
  return {
    role: signer.role && sheetLine(signer.role),
    lines: signer.lines,
    note: signer.note && !handwriting ? sheetLine(signer.note) : null,
    handwriting,
    seal: signer.seal,
  };
}

function handwritingOf(note: Line): Handwriting | null {
  const [part] = note;
  if (note.length !== 1 || part.kind !== 'blank') return null;
  const caption = lineText(part.parts);
  return { caption, size: blankSize('', caption, '') };
}
