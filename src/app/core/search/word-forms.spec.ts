import { hasStem, stemText, stemWord } from './word-forms';

/** The stems of a list of words. */
const stems = (words: string) => words.split(' ').map(stemWord);

/** True when all the words have one stem. */
function sameStem(words: string): boolean {
  return new Set(stems(words)).size === 1;
}

describe('stemWord', () => {
  it('gives the forms of a Bulgarian adjective one stem', () => {
    expect(
      sameStem('нотариален нотариална нотариално нотариални нотариалния нотариалният нотариалната'),
    ).toBe(true);
  });

  it('gives the forms of a Bulgarian noun one stem', () => {
    expect(sameStem('договор договора договорът договори договорите')).toBe(true);
    expect(sameStem('акт акта актът актове актовете')).toBe(true);
    expect(sameStem('нотариус нотариуса нотариусът нотариуси нотариусите')).toBe(true);
    expect(sameStem('сделка сделката сделки сделките')).toBe(true);
  });

  it('undoes the consonant change of a plural', () => {
    expect(sameStem('наследник наследници')).toBe(true);
    expect(sameStem('съпруг съпрузи')).toBe(true);
  });

  it('keeps apart words that only look alike', () => {
    expect(stemWord('търговци')).not.toBe(stemWord('търг'));
    expect(stemWord('подписи')).toBe('подпис');
  });

  it('gives the forms of an English word one stem', () => {
    expect(sameStem('notary notaries')).toBe(true);
    expect(sameStem('deed deeds')).toBe(true);
    expect(sameStem('sign signed signing signs')).toBe(true);
    expect(sameStem('tax taxes')).toBe(true);
    expect(stemWord('notes')).toBe('note');
  });

  it('keeps short words and numbers', () => {
    expect(stems('акт чл 25 28а')).toEqual(['акт', 'чл', '25', '28а']);
  });
});

describe('hasStem', () => {
  const text = stemText('договорна клауза за актуален акт');

  it('finds a short stem only as a whole stem', () => {
    expect(hasStem(text, stemWord('акта'))).toBe(true);
    expect(hasStem(stemText('актуален'), stemWord('акта'))).toBe(false);
  });

  it('finds a long stem also at the start of a longer stem', () => {
    expect(hasStem(text, stemWord('договорът'))).toBe(true);
  });
});
