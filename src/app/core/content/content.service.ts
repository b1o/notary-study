import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';

import type { Language } from '../i18n/language';
import type { ChapterMeta, Manifest, Part } from './content.models';

const DATA = 'data';

/** The course structure (parts and chapters) and the locations of the chapter files. */
@Service()
export class ContentService {
  readonly manifest = httpResource<Manifest>(() => `${DATA}/manifest.json`);

  readonly parts = computed<readonly Part[]>(() =>
    this.manifest.hasValue() ? this.manifest.value().parts : [],
  );
  readonly chapters = computed<readonly ChapterMeta[]>(() =>
    this.manifest.hasValue() ? this.manifest.value().chapters : [],
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
  chapterTextUrl(chapter: ChapterMeta, language: Language): string {
    return `${DATA}/chapters/${language}/${chapter.file}.md`;
  }

  /** URL of the chapter's objectives, flashcards and test questions (JSON). */
  chapterDataUrl(chapter: ChapterMeta, language: Language): string {
    return `${DATA}/chapters/${language}/${chapter.file}.json`;
  }
}
