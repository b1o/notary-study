import { groupParagraphs, paragraphOfLines, segmentText, splitHeading } from './law-text';

describe('segmentText', () => {
  it('separates amendment notes from the text', () => {
    expect(segmentText('да е влязла (изм. - ДВ, бр. 18 от 2003 г.) в сила')).toEqual([
      { kind: 'text', text: 'да е влязла ' },
      { kind: 'amendment', text: '(изм. - ДВ, бр. 18 от 2003 г.)' },
      { kind: 'text', text: ' в сила' },
    ]);
  });

  it('keeps a note with nested brackets whole', () => {
    const note = '(Нова - ДВ, бр. 19 от 2005 г. (в сила от 01.01.2006 г.))';
    expect(segmentText(`${note} Текст.`)[0]).toEqual({ kind: 'amendment', text: note });
  });

  it('reads notes in capital letters', () => {
    expect(segmentText('(ОБН. - ДВ, БР. 86 ОТ 1997 Г.)')).toEqual([
      { kind: 'amendment', text: '(ОБН. - ДВ, БР. 86 ОТ 1997 Г.)' },
    ]);
  });

  it('reads notes about one paragraph or item', () => {
    expect(segmentText('(Ал. 2 отм. - ДВ, бр. 12 от 1993 г.)')[0].kind).toBe('amendment');
    expect(segmentText('(Т. 3 изм. - ДВ, бр. 59 от 2007 г.)')[0].kind).toBe('amendment');
  });

  it('leaves other brackets in the text', () => {
    expect(segmentText('такси (в лв.)')).toEqual([{ kind: 'text', text: 'такси (в лв.)' }]);
  });
});

describe('paragraphOfLines', () => {
  it('uses the paragraph numbers, and items belong to the paragraph above', () => {
    const lines = ['Чл. 14. (1) Текст.', '(2) Необходимо е:', '1. условие;', '(3) Текст.'];
    expect(paragraphOfLines(lines)).toEqual(['1', '2', '2', '3']);
  });

  it('counts the lines of an act without paragraph numbers', () => {
    const lines = ['Чл. 19. Първа.', 'Втора.', 'Трета:', 'а) буква;'];
    expect(paragraphOfLines(lines)).toEqual(['1', '2', '3', '3']);
  });

  it('finds a paragraph number after an amendment note of the article', () => {
    const lines = [
      'Чл. 84. (Доп. - ДВ, бр. 18 от 2003 г.) (1) Текст:',
      '1. условие;',
      '(2) Текст.',
    ];
    expect(paragraphOfLines(lines)).toEqual(['1', '1', '2']);
  });
});

describe('groupParagraphs', () => {
  const groups = groupParagraphs([
    'Чл. 14. (1) Текст.',
    '(2) (Изм. - ДВ, бр. 18 от 2003 г.) Необходимо е:',
    '1. (изм. - ДВ, бр. 18 от 2003 г.) условие;',
    '2. условие.',
  ]);

  it('leaves out the article number and moves paragraph numbers to the marker', () => {
    expect(groups.map((group) => [group.number, group.marker])).toEqual([
      ['1', '(1)'],
      ['2', '(2)'],
    ]);
    expect(groups[0].lines[0].segments).toEqual([{ kind: 'text', text: 'Текст.' }]);
  });

  it('puts the items of a paragraph into its group, with their markers', () => {
    expect(groups[1].lines.map((line) => line.marker)).toEqual([undefined, '1.', '2.']);
  });

  it('lifts the notes at the start of a line out of the text', () => {
    expect(groups[1].lines[0].notes).toEqual(['(Изм. - ДВ, бр. 18 от 2003 г.)']);
    expect(groups[1].lines[0].segments).toEqual([{ kind: 'text', text: 'Необходимо е:' }]);
    expect(groups[1].lines[1].notes).toEqual(['(изм. - ДВ, бр. 18 от 2003 г.)']);
  });

  it('gives no markers to an act without paragraph numbers', () => {
    const plain = groupParagraphs(['Чл. 19. Първа.', 'Втора.']);
    expect(plain.map((group) => group.marker)).toEqual([undefined, undefined]);
  });

  it('moves a paragraph number after an amendment note to the marker, and keeps both notes', () => {
    const [first] = groupParagraphs([
      'Чл. 3. (Изм. - ДВ, бр. 42 от 2018 г.) (1) (Изм. и доп. - ДВ, бр. 55 от 2018 г.) Текст.',
      '(2) Текст.',
    ]);
    expect([first.number, first.marker]).toEqual(['1', '(1)']);
    expect(first.lines[0].notes).toEqual([
      '(Изм. - ДВ, бр. 42 от 2018 г.)',
      '(Изм. и доп. - ДВ, бр. 55 от 2018 г.)',
    ]);
    expect(first.lines[0].segments).toEqual([{ kind: 'text', text: 'Текст.' }]);
  });
});

describe('splitHeading', () => {
  it('splits the label, the title and the notes', () => {
    expect(splitHeading('Раздел V. Стажант-нотариус (Отм. - ДВ, бр. 18 от 2003 г.)')).toEqual({
      label: 'Раздел V',
      title: 'Стажант-нотариус',
      notes: ['(Отм. - ДВ, бр. 18 от 2003 г.)'],
      caps: false,
    });
  });

  it('marks titles in capital letters', () => {
    expect(splitHeading('Глава пета "а". КОНТРОЛ ВЪРХУ ДЕЙНОСТТА НА НОТАРИУСА')).toMatchObject({
      label: 'Глава пета "а"',
      title: 'КОНТРОЛ ВЪРХУ ДЕЙНОСТТА НА НОТАРИУСА',
      caps: true,
    });
  });

  it('keeps a heading without a label whole', () => {
    expect(splitHeading('I. Обикновени нотариални такси (в лв.)')).toMatchObject({
      label: undefined,
      title: 'I. Обикновени нотариални такси (в лв.)',
      caps: false,
    });
  });
});
