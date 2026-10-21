import { computed, Service } from '@angular/core';

import { isRecord, storedSignal } from '../storage/stored-signal';

export interface ChapterProgress {
  /** ISO date when the reader marked the chapter as read. */
  readonly readAt?: string;
}

interface ProgressState {
  readonly chapters: Readonly<Record<string, ChapterProgress>>;
  /** The chapter the reader opened last. */
  readonly lastChapter?: string;
}

const EMPTY: ProgressState = { chapters: {} };

/** Reading progress, saved in this browser only. */
@Service()
export class ProgressService {
  private readonly state = storedSignal<ProgressState>('nc.progress', EMPTY, (stored, fallback) =>
    isRecord(stored) && isRecord(stored['chapters']) ? (stored as unknown as ProgressState) : fallback,
  );

  readonly lastChapter = computed(() => this.state().lastChapter);
  readonly readCount = computed(() => Object.values(this.state().chapters).filter((c) => c.readAt).length);

  isRead(chapterId: string): boolean {
    return !!this.state().chapters[chapterId]?.readAt;
  }

  recordVisit(chapterId: string): void {
    this.state.update((state) => ({ ...state, lastChapter: chapterId }));
  }

  setRead(chapterId: string, read: boolean): void {
    this.state.update((state) => ({
      ...state,
      chapters: {
        ...state.chapters,
        [chapterId]: { ...state.chapters[chapterId], readAt: read ? new Date().toISOString() : undefined },
      },
    }));
  }
}
