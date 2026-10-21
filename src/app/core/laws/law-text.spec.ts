import { groupParagraphs, paragraphOfLines, segmentLine } from './law-text';

describe('segmentLine', () => {
  it('splits the article number, the paragraph number, the text and an amendment note', () => {
    expect(segmentLine('Чл. 2. (1) (Изм. - ДВ, бр. 18 от 2003 г.) Нотариус е лице.')).toEqual([
      { kind: 'number', text: 'Чл. 2.' },
      { kind: 'text', text: ' ' },
      { kind: 'paragraph', text: '(1)' },
      { kind: 'text', text: ' ' },
      { kind: 'amendment', text: '(Изм. - ДВ, бр. 18 от 2003 г.)' },
      { kind: 'text', text: ' Нотариус е лице.' },
    ]);
  });

  it('keeps an amendment note with nested brackets whole', () => {
    const note = '(Нова - ДВ, бр. 19 от 2005 г. (в сила от 01.01.2006 г.))';
    expect(segmentLine(`(2) ${note} Текст.`)).toContainEqual({ kind: 'amendment', text: note });
  });

  it('reads English lines', () => {
    expect(segmentLine('Art. 25. (1) The notary must protect the parties.').slice(0, 3)).toEqual([
      { kind: 'number', text: 'Art. 25.' },
      { kind: 'text', text: ' ' },
      { kind: 'paragraph', text: '(1)' },
    ]);
  });
});

describe('paragraphOfLines', () => {
  it('uses the paragraph numbers, and items belong to the paragraph above', () => {
    expect(
      paragraphOfLines([
        'Чл. 14. (1) Текст.',
        '(2) За вписване е необходимо:',
        '1. условие;',
        '(3) Текст.',
      ]),
    ).toEqual(['1', '2', '2', '3']);
  });

  it('counts the lines of an act without paragraph numbers', () => {
    expect(paragraphOfLines(['Чл. 19. Първа.', 'Втора.', 'Трета:', 'а) буква;'])).toEqual([
      '1',
      '2',
      '3',
      '3',
    ]);
  });
});

describe('groupParagraphs', () => {
  it('puts the items of a paragraph into its group', () => {
    const groups = groupParagraphs([
      'Чл. 14. (1) Текст.',
      '(2) Необходимо е:',
      '1. условие;',
      '2. условие.',
    ]);
    expect(groups.map((group) => [group.number, group.lines.length])).toEqual([
      ['1', 1],
      ['2', 3],
    ]);
    expect(groups[1].lines.map((line) => line.item)).toEqual([false, true, true]);
  });
});
