import { computed, inject, Service } from '@angular/core';

import type { ChapterMeta, GlossaryTerm } from '../content/content.models';
import { ContentService } from '../content/content.service';
import type { Language } from '../i18n/language';
import { GlossaryService } from '../reference/glossary.service';
import { isRecord, storedSignal } from '../storage/stored-signal';
import { grade, isDue, LEARNED_FROM_BOX, NEW_CARD, type CardState } from './leitner';

/** The decks besides the chapter decks (whose id is the chapter id). */
export const SPECIAL_DECKS = ['due', 'all', 'glossary'] as const;

/** A card to study. Front and back are Markdown. */
export interface StudyCard {
  /** Key of the card's box: "deeds:3" for the card with id 3, "g:нотариус" for a term. */
  readonly key: string;
  readonly front: string;
  readonly back: string;
  /** Language of the front when it differs from the page: the Bulgarian glossary terms. */
  readonly frontLang?: string;
  readonly chapterId?: string;
}

/** Flashcards: the decks, and the Leitner box of every card the reader studied (kept in the browser). */
@Service()
export class FlashcardsService {
  private readonly content = inject(ContentService);
  private readonly glossary = inject(GlossaryService);

  private readonly states = storedSignal<Readonly<Record<string, CardState>>>(
    'nc.cards',
    {},
    (stored, fallback) => (isRecord(stored) ? (stored as Record<string, CardState>) : fallback),
  );

  /** How many cards are due now, of all the cards the reader studied before. */
  readonly dueCount = computed(() => {
    const now = Date.now();
    return Object.values(this.states()).filter((state) => isDue(state, now)).length;
  });

  state(key: string): CardState {
    return this.states()[key] ?? NEW_CARD;
  }

  grade(key: string, knewIt: boolean): void {
    this.states.update((all) => ({ ...all, [key]: grade(this.state(key), knewIt, Date.now()) }));
  }

  /** How many cards of a chapter are learned (box 3 or higher). */
  learnedCount(chapterId: string): number {
    return Object.entries(this.states()).filter(
      ([key, state]) => key.startsWith(`${chapterId}:`) && state.box >= LEARNED_FROM_BOX,
    ).length;
  }

  /** The cards of a deck: a chapter id, or "all", "glossary" or "due". */
  async loadDeck(deck: string, language: Language): Promise<StudyCard[]> {
    if (deck === 'glossary') {
      return glossaryCards(await this.glossary.load(), language);
    }
    const chapter = this.content.chapter(deck);
    let chapters: readonly ChapterMeta[] = [];
    if (chapter) chapters = [chapter];
    else if (deck === 'all' || deck === 'due') chapters = this.content.chapters();
    const cards = await this.chapterCards(chapters, language);
    if (deck !== 'due') {
      return cards;
    }
    const now = Date.now();
    const all = [...cards, ...glossaryCards(await this.glossary.load(), language)];
    return all.filter((card) => isDue(this.state(card.key), now));
  }

  private async chapterCards(
    chapters: readonly ChapterMeta[],
    language: Language,
  ): Promise<StudyCard[]> {
    const data = await Promise.all(
      chapters.map((chapter) => this.content.loadData(chapter, language)),
    );
    return data.flatMap((chapterData, i) =>
      chapterData.cards.map((card) => ({
        key: `${chapters[i].id}:${card.id}`,
        front: card.front,
        back: card.back,
        chapterId: chapters[i].id,
      })),
    );
  }
}

function glossaryCards(terms: readonly GlossaryTerm[], language: Language): StudyCard[] {
  return terms.map((term) => ({
    key: `g:${term.bg}`,
    front: term.bg,
    back: `**${term.en}**\n\n${term.definition[language]}`,
    frontLang: 'bg',
  }));
}
