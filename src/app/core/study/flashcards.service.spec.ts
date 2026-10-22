import { TestBed } from '@angular/core/testing';

import type { ChapterData, ChapterMeta, Flashcard } from '../content/content.models';
import { ContentService } from '../content/content.service';
import { GlossaryService } from '../reference/glossary.service';
import { FlashcardsService } from './flashcards.service';

const DEEDS: ChapterMeta = {
  id: 'deeds',
  number: 14,
  part: 'acts',
  file: '14-deeds',
  minutes: 20,
  title: { bg: 'Нотариални актове', en: 'Notarial deeds' },
  summary: { bg: '', en: '' },
};

const card = (id: number, front: string): Flashcard => ({ id, front, back: `${front}.` });

describe('FlashcardsService', () => {
  /** The cards of the chapter as the content files hold them now. */
  let cards: Flashcard[];
  let flashcards: FlashcardsService;

  beforeEach(() => {
    localStorage.clear();
    const content: Partial<ContentService> = {
      chapter: (id) => (id === DEEDS.id ? DEEDS : undefined),
      loadData: async (): Promise<ChapterData> => ({
        id: DEEDS.id,
        objectives: [],
        cards,
        quiz: [],
      }),
    };
    const glossary: Partial<GlossaryService> = { load: async () => [] };
    TestBed.configureTestingModule({
      providers: [
        { provide: ContentService, useValue: content },
        { provide: GlossaryService, useValue: glossary },
      ],
    });
    flashcards = TestBed.inject(FlashcardsService);
  });

  async function deckCard(front: string) {
    const deck = await flashcards.loadDeck(DEEDS.id, 'en');
    return deck.find((study) => study.front === front);
  }

  it('keys a card by its id, not by its place in the chapter', async () => {
    cards = [card(4, 'Form'), card(0, 'Seal')];
    const deck = await flashcards.loadDeck(DEEDS.id, 'en');
    expect(deck.map((study) => study.key)).toEqual(['deeds:4', 'deeds:0']);
  });

  it('keeps the box of a card when a new card comes before it', async () => {
    cards = [card(0, 'Form'), card(1, 'Seal')];
    const seal = await deckCard('Seal');
    flashcards.grade(seal!.key, true);
    flashcards.grade(seal!.key, true);

    cards = [card(2, 'Witnesses'), card(0, 'Form'), card(1, 'Seal')];

    expect(flashcards.state((await deckCard('Seal'))!.key).box).toBe(2);
    expect(flashcards.state((await deckCard('Witnesses'))!.key).box).toBe(0);
  });
});
