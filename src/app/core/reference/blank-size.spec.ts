import { blankSize, DEFAULT_BLANK_SIZE, isEmptyHint } from './blank-size';

/** The size of the blank "[...]" with this text before it and this text after it. */
function emptyBlank(before: string, after = ''): number {
  return blankSize(before, '...', after);
}

describe('blankSize', () => {
  it('sizes a blank by its hint', () => {
    expect(blankSize('', 'три имена', '')).toBe(36);
    expect(blankSize('', 'Три имена на детето', '')).toBe(36);
    expect(blankSize('пред мен, ', 'име на нотариуса', '')).toBe(26);
    expect(blankSize('', 'дата', '')).toBe(10);
    expect(blankSize('Днес, ', 'дата словом и цифром', ' г.')).toBe(75);
    expect(blankSize('', 'сума цифром', '')).toBe(14);
    expect(blankSize('', 'сума словом', '')).toBe(50);
    expect(blankSize('', 'година', '')).toBe(4);
    expect(blankSize('', 'град', '')).toBe(16);
    expect(blankSize('', 'описание с идентификатор', '')).toBe(160);
    expect(blankSize('', 'собственоръчно изписани три имена', '')).toBe(33);
  });

  it('sizes an empty blank by the label before it', () => {
    expect(emptyBlank('Иван Иванов, ЕГН ')).toBe(10);
    expect(emptyBlank('с лична карта № ')).toBe(9);
    expect(emptyBlank('по банкова сметка IBAN ')).toBe(27);
    expect(emptyBlank('„[фирма]“ ООД, ЕИК ')).toBe(13);
    expect(emptyBlank('САМОСТОЯТЕЛЕН ОБЕКТ с идентификатор ')).toBe(22);
    expect(emptyBlank('рама (VIN) № ')).toBe(17);
    expect(emptyBlank('с постоянен адрес ')).toBe(56);
    expect(emptyBlank('в кантората ми в гр. ')).toBe(16);
    expect(emptyBlank('ул. ')).toBe(28);
    expect(emptyBlank('ул. [...] № ')).toBe(4);
    expect(emptyBlank('рег. № ')).toBe(10);
    expect(emptyBlank('№ [...], том ')).toBe(6);
  });

  it('sizes an empty blank by the word after it', () => {
    expect(emptyBlank('Такса ', ' евро.')).toBe(14);
    expect(emptyBlank('както и ', ' % идеални части')).toBe(7);
    expect(emptyBlank('с площ ', ' кв. м')).toBe(9);
    expect(emptyBlank('заедно с помещение с ', ' (словом) кв. м')).toBe(9);
  });

  it('tells a date from a year before "г."', () => {
    expect(emptyBlank('Вх. рег. № [...] от ', ' г.')).toBe(10);
    expect(emptyBlank('Акт № [...], том [...], дело № [...]/', ' г.')).toBe(4);
  });

  it('gives choices no extra room, but a description with choices its full room', () => {
    expect(blankSize('', 'майка/баща', '')).toBe(0);
    expect(blankSize('', 'описание на имота / превозното средство', '')).toBe(160);
  });

  it('gives an unknown blank the default size', () => {
    expect(blankSize('', 'занятие', '')).toBe(DEFAULT_BLANK_SIZE);
    expect(emptyBlank('освен ', '.')).toBe(DEFAULT_BLANK_SIZE);
  });
});

describe('isEmptyHint', () => {
  it('treats dots and ellipses as no hint', () => {
    expect(isEmptyHint('...')).toBe(true);
    expect(isEmptyHint('.....')).toBe(true);
    expect(isEmptyHint('…')).toBe(true);
    expect(isEmptyHint('дата')).toBe(false);
  });
});
