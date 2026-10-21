import { HttpClient, httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { PromiseCache } from '../data/promise-cache';
import type { Language } from '../i18n/language';
import type { ChapterData, ChapterMeta, Manifest, Part } from './content.models';

/** A part of the course with its number ("Part 3") and its chapters in reading order. */
export interface PartOutline {
  readonly part: Part;
  readonly number: number;
  readonly chapters: readonly ChapterMeta[];
}

const DATA = 'data';

/** The course structure (parts and chapters) and the chapter files. */
@Service()
export class ContentService {
  private readonly http = inject(HttpClient);
  /** Chapter files are loaded once per language and then shared by every view. */
  private readonly texts = new PromiseCache<string>();
  private readonly data = new PromiseCache<ChapterData>();

  readonly manifest = httpResource<Manifest>(() => `${DATA}/manifest.json`);

  readonly parts = computed<readonly Part[]>(() =>
    this.manifest.hasValue() ? this.manifest.value().parts : [],
  );
  readonly chapters = computed<readonly ChapterMeta[]>(() =>
    this.manifest.hasValue() ? this.manifest.value().chapters : [],
  );

  /** All parts with their chapters, for the chapter lists of the course, the tests and the cards. */
  readonly outline = computed<readonly PartOutline[]>(() =>
    this.parts().map((part, index) => ({
      part,
      number: index + 1,
      chapters: this.chaptersOf(part),
    })),
  );

  private readonly chaptersById = computed(
    () => new Map(this.chapters().map((chapter) => [chapter.id, chapter])),
  );

  chapter(id: string): ChapterMeta | undefined {
    return this.chaptersById().get(id);
  }

  chaptersOf(part: Part): ChapterMeta[] {
    return part.chapters.flatMap((id) => this.chapter(id) ?? []);
  }

  /** The 1-based position of a part, used for "Part 3". */
  partNumber(partId: string): number {
    return this.parts().findIndex((part) => part.id === partId) + 1;
  }

  /** The chapters before and after the given one in reading order. */
  neighbours(id: string): { previous?: ChapterMeta; next?: ChapterMeta } {
    const chapters = this.chapters();
    const index = chapters.findIndex((chapter) => chapter.id === id);
    return index < 0 ? {} : { previous: chapters[index - 1], next: chapters[index + 1] };
  }

  /** URL of the chapter text (Markdown). */
  private chapterTextUrl(chapter: ChapterMeta, language: Language): string {
    return `${DATA}/chapters/${language}/${chapter.file}.md`;
  }

  /** URL of the chapter's objectives, flashcards and test questions (JSON). */
  private chapterDataUrl(chapter: ChapterMeta, language: Language): string {
    return `${DATA}/chapters/${language}/${chapter.file}.json`;
  }

  /** The chapter text (Markdown). */
  loadText(chapter: ChapterMeta, language: Language): Promise<string> {
    const url = this.chapterTextUrl(chapter, language);
    return this.texts.get(url, () => firstValueFrom(this.http.get(url, { responseType: 'text' })));
  }

  /** The chapter's objectives, flashcards and test questions. */
  loadData(chapter: ChapterMeta, language: Language): Promise<ChapterData> {
    const url = this.chapterDataUrl(chapter, language);
    return this.data.get(url, () => firstValueFrom(this.http.get<ChapterData>(url)));
  }

  /** The data of every chapter, in reading order: for the final exam and the flashcard decks. */
  loadAllData(language: Language): Promise<ChapterData[]> {
    return Promise.all(this.chapters().map((chapter) => this.loadData(chapter, language)));
  }
}
