import { parseLine } from './document-layout';
import { FILL_PIECE, sheetLine, sheetText, sliceLine, type SheetPart } from './sheet-line';

/** The line as text, with "_" for each piece of a dotted line. */
function text(source: string): string {
  return sheetText(sheetLine(parseLine(source)).parts);
}

function blankOf(parts: readonly SheetPart[]): Extract<SheetPart, { kind: 'blank' }> {
  const blank = parts.find((part) => part.kind === 'blank');
  if (!blank || blank.kind !== 'blank') throw new Error('no blank');
  return blank;
}

describe('sheetLine', () => {
  it('gives an empty blank a dotted line as long as what goes in it', () => {
    // ЕГН: 10 digits, in pieces of 5.
    expect(text('ЕГН [...]')).toBe('ЕГН [__]');
    const line = sheetLine(parseLine('ЕГН [...]'));
    expect(blankOf(line.parts).empty).toBe(true);
    expect(line.length).toBe('ЕГН '.length + 2);
  });

  it('adds to a hint the room that the hint does not fill', () => {
    // Three names: 36 characters, of which the hint "три имена" shows 9.
    const line = sheetLine(parseLine('[три имена]'));
    const [hint, fill] = blankOf(line.parts).parts;

    expect(hint).toEqual({ kind: 'text', text: 'три имена', at: 0 });
    expect(fill.kind === 'fill' && fill.pieces).toEqual([5, 5, 5, 5, 5, 2]);
    expect(fill.kind === 'fill' && fill.at).toBe(9);
  });

  it('gives choices no dotted line, and a blank inside them its own', () => {
    expect(text('[майка/баща]')).toBe('[майка/баща]');
    // "[дата]" holds 10 characters: the hint shows 4, the dotted line 6 (two pieces).
    expect(text('[от [дата] / изцяло]')).toBe('[от [дата__] / изцяло]');
  });

  it('numbers every visible piece in reading order', () => {
    const line = sheetLine(parseLine('[ ] а [...] б'));
    const positions = line.parts.flatMap(function at(part): number[] {
      return part.kind === 'blank' ? part.parts.flatMap(at) : [part.at];
    });

    expect(positions).toEqual([0, 1, 4, 7]);
    expect(line.length).toBe(1 + ' а '.length + Math.ceil(14 / FILL_PIECE) + ' б'.length);
  });
});

describe('sliceLine', () => {
  it('cuts the text of a line at a position', () => {
    const line = sheetLine(parseLine('Днес се явиха страните.'));

    expect(sheetText(sliceLine(line, 0, 8).parts)).toBe('Днес се ');
    expect(sheetText(sliceLine(line, 8, line.length).parts)).toBe('явиха страните.');
  });

  it('leaves the brackets of a cut blank to the piece where the blank begins and ends', () => {
    const line = sheetLine(parseLine('А [начин на плащане] Б'));
    const first = sliceLine(line, 0, 8);
    const second = sliceLine(line, 8, line.length);

    expect(sheetText(first.parts)).toBe('А [начин ');
    expect(sheetText(second.parts)).toBe('на плащане] Б');
    expect(blankOf(first.parts)).toMatchObject({ opens: true, closes: false });
    expect(blankOf(second.parts)).toMatchObject({ opens: false, closes: true });
  });

  it('cuts a dotted line between its pieces', () => {
    const line = sheetLine(parseLine('адрес [...]'));
    const fillStart = 'адрес '.length;

    expect(sheetText(sliceLine(line, 0, fillStart + 4).parts)).toBe('адрес [____');
    expect(sheetText(sliceLine(line, fillStart + 4, line.length).parts)).toBe(
      `${'_'.repeat(line.length - fillStart - 4)}]`,
    );
  });
});
