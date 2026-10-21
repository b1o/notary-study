/*
 * Leitner boxes for flashcards. A new card is in box 0. A card that the reader knows moves one
 * box up; a card that the reader misses goes back to box 1. Each box waits longer before the
 * card is due again.
 */

/** Days until a card in each box is due again. Index = box. */
export const BOX_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const LAST_BOX = BOX_DAYS.length - 1;
/** From this box on, a card counts as learned. */
export const LEARNED_FROM_BOX = 3;

const DAY = 24 * 60 * 60 * 1000;

export interface CardState {
  readonly box: number;
  /** When the card is due again: the start of a day, in milliseconds since 1970. */
  readonly due: number;
}

export const NEW_CARD: CardState = { box: 0, due: 0 };

/** Midnight at the start of the day of `time`, in local time. */
export function startOfDay(time: number): number {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** The state after an answer: one box up when the reader knew the card, else back to box 1. */
export function grade(state: CardState, knewIt: boolean, now: number): CardState {
  const box = knewIt ? Math.min(LAST_BOX, state.box + 1) : 1;
  return { box, due: startOfDay(now) + BOX_DAYS[box] * DAY };
}

/** A card is due when the reader studied it before and its day has come. New cards are not due. */
export function isDue(state: CardState, now: number): boolean {
  return state.box > 0 && state.due <= now;
}

/** The order to study a deck in: due cards first, then the lower boxes (new and weak cards). */
export function studyOrder<T>(
  cards: readonly T[],
  stateOf: (card: T) => CardState,
  now: number,
): T[] {
  return [...cards].sort((a, b) => {
    const stateA = stateOf(a);
    const stateB = stateOf(b);
    return Number(isDue(stateB, now)) - Number(isDue(stateA, now)) || stateA.box - stateB.box;
  });
}
