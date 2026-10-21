/**
 * A line of a template, ready for the sheet: each blank has a dotted line as long as what goes in
 * it (blank-size.ts), and every visible piece has a position, so that a paragraph can be cut where
 * a line on the page ends.
 *
 * Positions count the visible pieces in reading order: one for each character of text, one for a
 * box to tick, one for each piece of a dotted line. The brackets of a blank have no position:
 * they are there only for screen readers.
 */

import { blankSize, isEmptyHint } from './blank-size';
import { lineText, type Line } from './document-layout';

/** The width of one piece of a dotted line, in characters. A dotted line wraps between pieces. */
export const FILL_PIECE = 5;

/** A dotted line to write on: the width of each piece, in characters. */
export interface FillPart {
  readonly kind: 'fill';
  readonly pieces: readonly number[];
  readonly at: number;
}

export type SheetPart =
  | { readonly kind: 'text'; readonly text: string; readonly at: number }
  | { readonly kind: 'tick'; readonly at: number }
  | FillPart
  | {
      readonly kind: 'blank';
      readonly parts: readonly SheetPart[];
      /** False when the blank began on an earlier page: its opening bracket is there. */
      readonly opens: boolean;
      /** False when the blank goes on to the next page: its closing bracket is there. */
      readonly closes: boolean;
      /** A blank without a hint, "[...]": only its dotted line shows. */
      readonly empty: boolean;
    };

export interface SheetLine {
  readonly parts: readonly SheetPart[];
  /** The number of positions: the position after the last piece. */
  readonly length: number;
}

/** The sheet form of a parsed line. */
export function sheetLine(line: Line): SheetLine {
  const whole = lineText(line);
  let at = 0;
  // `offset` is the place of a part in `whole`, which writes blanks with their brackets.
  const convert = (parts: Line, start: number): SheetPart[] => {
    let offset = start;
    return parts.map((part): SheetPart => {
      const width = lineText([part]).length;
      const before = whole.slice(0, offset);
      offset += width;
      if (part.kind === 'text') {
        const result = { kind: 'text', text: part.text, at } as const;
        at += part.text.length;
        return result;
      }
      if (part.kind === 'tick') {
        return { kind: 'tick', at: at++ };
      }
      const hint = lineText(part.parts);
      const empty = isEmptyHint(hint);
      const shown = empty ? [] : convert(part.parts, offset - width + 1);
      const size = blankSize(before, hint, whole.slice(offset));
      const room = empty ? size : size - visibleLength(shown);
      const fill = room > 0 ? [fillPart(room, at)] : [];
      at += fill.reduce((sum, piece) => sum + piece.pieces.length, 0);
      return { kind: 'blank', parts: [...shown, ...fill], opens: true, closes: true, empty };
    });
  };
  const parts = convert(line, 0);
  return { parts, length: at };
}

/** The part of a line from position `from` up to (not including) position `to`. */
export function sliceLine(line: SheetLine, from: number, to: number): SheetLine {
  const slice = (parts: readonly SheetPart[]): SheetPart[] =>
    parts.flatMap((part): SheetPart[] => {
      switch (part.kind) {
        case 'text': {
          const start = Math.max(from, part.at);
          const end = Math.min(to, part.at + part.text.length);
          if (start >= end) return [];
          return [
            { kind: 'text', text: part.text.slice(start - part.at, end - part.at), at: start },
          ];
        }
        case 'tick':
          return part.at >= from && part.at < to ? [part] : [];
        case 'fill': {
          const start = Math.max(from, part.at);
          const end = Math.min(to, part.at + part.pieces.length);
          if (start >= end) return [];
          return [
            { ...part, pieces: part.pieces.slice(start - part.at, end - part.at), at: start },
          ];
        }
        case 'blank': {
          const inner = slice(part.parts);
          if (!inner.length) return [];
          const [first, last] = [firstPosition(part), lastPosition(part)];
          return [
            {
              ...part,
              parts: inner,
              opens: part.opens && first >= from,
              closes: part.closes && last < to,
            },
          ];
        }
      }
    });
  return { parts: slice(line.parts), length: Math.min(to, line.length) - from };
}

/** The visible text of a line, without the dotted lines: for a test or a label. */
export function sheetText(parts: readonly SheetPart[]): string {
  return parts
    .map((part) => {
      if (part.kind === 'text') return part.text;
      if (part.kind === 'tick') return '[ ]';
      if (part.kind === 'fill') return '_'.repeat(part.pieces.length);
      return `${part.opens ? '[' : ''}${sheetText(part.parts)}${part.closes ? ']' : ''}`;
    })
    .join('');
}

/** A dotted line of `size` characters, in pieces of FILL_PIECE characters. */
function fillPart(size: number, at: number): FillPart {
  const pieces = Array.from({ length: Math.ceil(size / FILL_PIECE) }, (_, index) =>
    Math.min(FILL_PIECE, size - index * FILL_PIECE),
  );
  return { kind: 'fill', pieces, at };
}

/** The number of characters that the hint of a blank shows. */
function visibleLength(parts: readonly SheetPart[]): number {
  return parts.reduce((sum, part) => {
    if (part.kind === 'text') return sum + part.text.length;
    if (part.kind === 'tick') return sum + 1;
    if (part.kind === 'fill') return sum + part.pieces.reduce((total, piece) => total + piece, 0);
    return sum + visibleLength(part.parts);
  }, 0);
}

/** The first position in a part. A blank always has a hint or a dotted line. */
function firstPosition(part: SheetPart): number {
  return part.kind === 'blank' ? firstPosition(part.parts[0]) : part.at;
}

function lastPosition(part: SheetPart): number {
  if (part.kind === 'blank') return lastPosition(part.parts[part.parts.length - 1]);
  if (part.kind === 'text') return part.at + part.text.length - 1;
  if (part.kind === 'fill') return part.at + part.pieces.length - 1;
  return part.at;
}
