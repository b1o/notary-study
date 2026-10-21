import {
  grade,
  isDue,
  LAST_BOX,
  NEW_CARD,
  startOfDay,
  studyOrder,
  type CardState,
} from './leitner';

const NOON = new Date(2026, 9, 21, 12, 0).getTime();
const DAY = 24 * 60 * 60 * 1000;

describe('grade', () => {
  it('moves a known card one box up and sets its next day', () => {
    const state = grade({ box: 2, due: 0 }, true, NOON);
    expect(state).toEqual({ box: 3, due: startOfDay(NOON) + 7 * DAY });
  });

  it('sends a missed card back to box 1, due tomorrow', () => {
    expect(grade({ box: 4, due: 0 }, false, NOON)).toEqual({
      box: 1,
      due: startOfDay(NOON) + DAY,
    });
  });

  it('keeps a card in the last box', () => {
    expect(grade({ box: LAST_BOX, due: 0 }, true, NOON).box).toBe(LAST_BOX);
  });
});

describe('isDue', () => {
  it('is false for a new card', () => {
    expect(isDue(NEW_CARD, NOON)).toBe(false);
  });

  it('is true from the start of the due day', () => {
    const state: CardState = { box: 1, due: startOfDay(NOON) };
    expect(isDue(state, NOON)).toBe(true);
    expect(isDue(state, startOfDay(NOON) - 1)).toBe(false);
  });
});

describe('studyOrder', () => {
  it('puts due cards first, then the lower boxes', () => {
    const states: Record<string, CardState> = {
      later: { box: 1, due: NOON + 5 * DAY },
      newCard: NEW_CARD,
      due: { box: 3, due: NOON - DAY },
    };
    const order = studyOrder(['later', 'newCard', 'due'], (key) => states[key], NOON);
    expect(order).toEqual(['due', 'newCard', 'later']);
  });
});
