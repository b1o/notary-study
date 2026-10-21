import { documentLayout } from './document-layout';
import { sheetFlow, type FlowItem, type SheetBlock } from './sheet-flow';
import { sheetText } from './sheet-line';

/** An item as "kind gap keep", with "break" for an item that can break between lines. */
function rule(item: FlowItem): string {
  return [
    item.block.kind,
    item.gap ? 'gap' : '-',
    item.keepWithNext ? 'keep' : '-',
    ...(item.breakable ? ['break'] : []),
  ].join(' ');
}

function flowOf(lines: readonly string[]): FlowItem[] {
  return sheetFlow(documentLayout(lines.join('\n')));
}

function signersOf(block: SheetBlock) {
  return block.kind === 'signatures' ? block.rows.flatMap((row) => row.signers) : [];
}

describe('sheetFlow', () => {
  it('gives each line of a text its own paragraph, and an empty line only after a blank line', () => {
    const flow = flowOf(['ПЪЛНОМОЩНО', '', 'Първи ред,', 'втори ред.']);

    expect(flow.map(rule)).toEqual([
      'title - keep',
      'paragraph gap - break',
      'paragraph - - break',
    ]);
  });

  it('keeps titles and headings with the text after them', () => {
    const flow = flowOf(['ПЪЛНОМОЩНО', '', '№ 1', '', 'Аз,', '', 'УПЪЛНОМОЩАВАМ', '', 'Иван.']);

    expect(flow.map(rule)).toEqual([
      'title - keep',
      'register gap keep',
      'paragraph gap - break',
      'heading gap keep',
      'paragraph gap - break',
    ]);
  });

  it('keeps a line that ends with ":" with what it introduces', () => {
    const flow = flowOf(['ДЕКЛАРАЦИЯ', '', 'произхождат от:', '[ ] спестявания']);

    expect(flow.map(rule).slice(1)).toEqual(['paragraph gap keep break', 'paragraph - - break']);
  });

  it('keeps the last text, the signatures and the stamps together, as Art. 19(1) asks', () => {
    const flow = flowOf([
      'ДОГОВОР',
      '',
      'Текст.',
      '',
      'ПРОДАВАЧ: ..........   КУПУВАЧ: ..........',
      '---',
      'удостоверявам подписите',
      'НОТАРИУС: ..........   (печат)',
      '---',
      'удостоверявам съдържанието',
      'НОТАРИУС: ..........   (печат)',
    ]);

    expect(flow.map(rule)).toEqual([
      'title - keep',
      'paragraph gap keep break',
      'signatures gap keep',
      'stamp gap keep',
      'stamp gap -',
    ]);
    const stamp = flow[3].block;
    expect(stamp.kind === 'stamp' && stamp.blocks.map((block) => block.kind)).toEqual([
      'paragraph',
      'signatures',
    ]);
  });

  it('puts the seal of a stamp beside the stamp, not in its signature row', () => {
    const [, , stamp] = flowOf([
      'АКТ',
      '',
      'Текст.',
      '---',
      'удостоверявам',
      'НОТАРИУС: ..........   (печат)',
    ]);

    expect(stamp.block.kind === 'stamp' && stamp.block.seal).toBe(true);
    const signatures = stamp.block.kind === 'stamp' ? stamp.block.blocks[1] : stamp.block;
    expect(signersOf(signatures).map((signer) => signer.seal)).toEqual([false]);
  });

  it('turns a note that is one blank into a line for the name written by hand', () => {
    const [, signatures] = flowOf([
      'АКТ',
      '',
      'ПРОДАВАЧ: ..........  ([собственоръчно изписани три имена])',
      'НОТАРИУС: ..........',
    ]);
    const [seller, notary] = signersOf(signatures.block);

    expect(seller.handwriting).toEqual({ caption: 'собственоръчно изписани три имена', size: 33 });
    expect(seller.note).toBeNull();
    expect(seller.role && sheetText(seller.role.parts)).toBe('ПРОДАВАЧ:');
    expect(notary).toMatchObject({ handwriting: null, seal: true });
  });
});
