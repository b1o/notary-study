import { computed, Service } from '@angular/core';

import { isRecord, storedSignal } from '../storage/stored-signal';

export interface ChapterProgress {
  /** ISO date when the reader marked the chapter as read. */
  readonly readAt?: string;
  /** Best and latest score of the chapter test, in percent. */
  readonly bestScore?: number;
  readonly lastScore?: number;
}

export interface ExamAttempt {
  /** ISO date of the attempt. */
  readonly at: string;
  readonly score: number;
}

interface ProgressState {
  readonly chapters: Readonly<Record<string, ChapterProgress>>;
  /** The chapter the reader opened last. */
  readonly lastChapter?: string;
  readonly exams?: readonly ExamAttempt[];
}

const EMPTY: ProgressState = { chapters: {} };

/** Reading progress and test results, saved in this browser only. */
@Service()
export class ProgressService {
  private readonly state = storedSignal<ProgressState>('nc.progress', EMPTY, (stored, fallback) =>
    isRecord(stored) && isRecord(stored['chapters'])
      ? (stored as unknown as ProgressState)
      : fallback,
  );

  readonly lastChapter = computed(() => this.state().lastChapter);
  readonly readCount = computed(
    () => Object.values(this.state().chapters).filter((c) => c.readAt).length,
  );
  /** Final exam attempts, the latest first. */
  readonly exams = computed(() => [...(this.state().exams ?? [])].reverse());

  isRead(chapterId: string): boolean {
    return !!this.state().chapters[chapterId]?.readAt;
  }

  bestScore(chapterId: string): number | undefined {
    return this.state().chapters[chapterId]?.bestScore;
  }

  recordVisit(chapterId: string): void {
    this.state.update((state) => ({ ...state, lastChapter: chapterId }));
  }

  setRead(chapterId: string, read: boolean): void {
    this.updateChapter(chapterId, { readAt: read ? new Date().toISOString() : undefined });
  }

  recordTest(chapterId: string, score: number): void {
    const best = Math.max(score, this.bestScore(chapterId) ?? 0);
    this.updateChapter(chapterId, { bestScore: best, lastScore: score });
  }

  recordExam(score: number): void {
    this.state.update((state) => ({
      ...state,
      exams: [...(state.exams ?? []), { at: new Date().toISOString(), score }],
    }));
  }

  private updateChapter(chapterId: string, changes: Partial<ChapterProgress>): void {
    this.state.update((state) => ({
      ...state,
      chapters: {
        ...state.chapters,
        [chapterId]: { ...state.chapters[chapterId], ...changes },
      },
    }));
  }
}
