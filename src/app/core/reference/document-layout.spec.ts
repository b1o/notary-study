import {
  documentLayout,
  lineText,
  parseLine,
  type DocumentBlock,
  type Signer,
} from './document-layout';

/** The blocks as kinds with their text, which reads better in a test than the parts. */
function outline(blocks: readonly DocumentBlock[]): string[] {
  return blocks.map((block) => {
    switch (block.kind) {
      case 'title':
        return ['title', lineText(block.title), ...block.subtitle.map(lineText)].join(' | ');
      case 'register':
      case 'heading':
        return `${block.kind} | ${lineText(block.line)}`;
      case 'text':
        return ['text', ...block.lines.map(lineText)].join(' | ');
      case 'signatures':
        return `signatures | ${block.rows.length} rows`;
    }
  });
}

function signers(block: DocumentBlock | undefined): readonly Signer[][] {
  return block?.kind === 'signatures' ? block.rows.map((row) => [...row.signers]) : [];
}

function roleOf(person: Signer): string | null {
  return person.role && lineText(person.role);
}

describe('documentLayout', () => {
  it('finds the title, the register line, the text and the signatures of a deed', () => {
    const layout = documentLayout(
      [
        'НОТАРИАЛЕН АКТ',
        'за покупко-продажба на недвижим имот',
        '',
        '№ [...], том [...], рег. № [...], дело № [...] от [година] г.',
        '',
        'Днес, [дата] г., пред мен, [име на нотариуса], се явиха:',
        '',
        '1. [Три имена], като ПРОДАВАЧ, и',
        '2. [Три имена], като КУПУВАЧ,',
        '',
        'ПРОДАВАЧ: ..........................  ([собственоръчно изписани три имена])',
        'КУПУВАЧ:  ..........................  ([собственоръчно изписани три имена])',
        '',
        'НОТАРИУС: ..........................',
      ].join('\n'),
    );

    expect(outline(layout.body)).toEqual([
      'title | НОТАРИАЛЕН АКТ | за покупко-продажба на недвижим имот',
      'register | № [...], том [...], рег. № [...], дело № [...] от [година] г.',
      'text | Днес, [дата] г., пред мен, [име на нотариуса], се явиха:',
      'text | 1. [Три имена], като ПРОДАВАЧ, и | 2. [Три имена], като КУПУВАЧ,',
      'signatures | 2 rows',
      'signatures | 1 rows',
    ]);
    expect(layout.stamp).toEqual([]);
  });

  it('reads the role, the note and the seal of each signer', () => {
    const { body } = documentLayout(
      [
        'ПЪЛНОМОЩНО',
        '',
        'ПРОДАВАЧ: ..........................  ([собственоръчно изписани три имена])',
        'ДАРИТЕЛИ: ..................  ..................',
        'ДАРЕН:    ..................',
        'КРЕДИТОР: ..................   ИПОТЕКАРЕН ДЛЪЖНИК: ..................',
        'НОТАРИУС: ..................',
      ].join('\n'),
    );
    const rows = signers(body[1]);

    expect(rows.map((row) => row.map(roleOf))).toEqual([
      ['ПРОДАВАЧ:'],
      ['ДАРИТЕЛИ:'],
      ['ДАРЕН:'],
      ['КРЕДИТОР:', 'ИПОТЕКАРЕН ДЛЪЖНИК:'],
      ['НОТАРИУС:'],
    ]);
    expect(rows[0][0].note && lineText(rows[0][0].note)).toBe(
      '[собственоръчно изписани три имена]',
    );
    expect(rows[1][0].lines).toBe(2);
    expect(rows[4][0].seal).toBe(true);
    expect(rows[3].some((person) => person.seal)).toBe(false);
  });

  it('puts the place and the date before the signer, and a note on the next line under it', () => {
    const { body } = documentLayout(
      [
        'ПЪЛНОМОЩНО',
        '',
        '[Дата], гр. [...]                       УПЪЛНОМОЩИТЕЛ: ..................',
        '                                       ([собственоръчно изписани три имена])',
      ].join('\n'),
    );
    const block = body[1];

    expect(block.kind).toBe('signatures');
    if (block.kind !== 'signatures') return;
    const [row] = block.rows;
    expect(row.place && lineText(row.place)).toBe('[Дата], гр. [...]');
    expect(roleOf(row.signers[0])).toBe('УПЪЛНОМОЩИТЕЛ:');
    expect(row.signers[0].note && lineText(row.signers[0].note)).toBe(
      '[собственоръчно изписани три имена]',
    );
  });

  it('sets a short line in capitals as a heading', () => {
    const { body } = documentLayout(
      [
        'ПЪЛНОМОЩНО',
        '',
        'Долуподписаният [три имена],',
        '',
        'УПЪЛНОМОЩАВАМ',
        '',
        'ДЕКЛАРИРАМ, ЧЕ:',
      ].join('\n'),
    );

    expect(outline(body)).toEqual([
      'title | ПЪЛНОМОЩНО',
      'text | Долуподписаният [три имена],',
      'heading | УПЪЛНОМОЩАВАМ',
      'heading | ДЕКЛАРИРАМ, ЧЕ:',
    ]);
  });

  it('puts the certification after "---" in the stamp, with its text and the notary', () => {
    const layout = documentLayout(
      [
        'ПЪЛНОМОЩНО',
        '',
        'Текст.',
        '',
        '---',
        'Удостоверявам подписа на [три имена].',
        'Рег. № [...] / [дата]. Такса [...] евро.',
        'НОТАРИУС: ..................   (печат)',
      ].join('\n'),
    );

    expect(outline(layout.body)).toEqual(['title | ПЪЛНОМОЩНО', 'text | Текст.']);
    expect(outline(layout.stamp)).toEqual([
      'text | Удостоверявам подписа на [три имена]. | Рег. № [...] / [дата]. Такса [...] евро.',
      'signatures | 1 rows',
    ]);
    const [notary] = signers(layout.stamp[1])[0];
    expect(notary.seal).toBe(true);
    expect(notary.note).toBeNull();
  });
});

describe('parseLine', () => {
  it('finds blanks, blanks inside blanks, and boxes to tick', () => {
    expect(parseLine('[ ] друго: [от [дата] / изцяло]')).toEqual([
      { kind: 'tick' },
      { kind: 'text', text: ' друго: ' },
      {
        kind: 'blank',
        parts: [
          { kind: 'text', text: 'от ' },
          { kind: 'blank', parts: [{ kind: 'text', text: 'дата' }] },
          { kind: 'text', text: ' / изцяло' },
        ],
      },
    ]);
  });

  it('keeps a closing bracket without an opening one as text', () => {
    expect(lineText(parseLine('а) б]'))).toBe('а) б]');
  });
});
