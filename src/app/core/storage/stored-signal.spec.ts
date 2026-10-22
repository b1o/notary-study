import { TestBed } from '@angular/core/testing';

import { isRecord, storedSignal } from './stored-signal';

const KEY = 'nc.test';

type Marks = Readonly<Record<string, boolean>>;

function createMarks() {
  return TestBed.runInInjectionContext(() =>
    storedSignal<Marks>(KEY, {}, (stored, fallback) =>
      isRecord(stored) ? (stored as Marks) : fallback,
    ),
  );
}

/** What another tab of the app does: it saves its value, and the browser tells this tab. */
function saveInOtherTab(key: string, value: unknown): void {
  const newValue = JSON.stringify(value);
  localStorage.setItem(key, newValue);
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

function stored(): unknown {
  return JSON.parse(localStorage.getItem(KEY) ?? 'null');
}

describe('storedSignal', () => {
  beforeEach(() => localStorage.clear());

  it('saves each change', () => {
    const marks = createMarks();
    marks.set({ deeds: true });
    TestBed.tick();
    expect(stored()).toEqual({ deeds: true });
  });

  it('takes over a value that another tab saves', () => {
    const marks = createMarks();
    TestBed.tick();

    saveInOtherTab(KEY, { deeds: true });

    expect(marks()).toEqual({ deeds: true });
  });

  it('keeps the change of another tab when this tab saves later', () => {
    const marks = createMarks();
    TestBed.tick();

    saveInOtherTab(KEY, { deeds: true });
    marks.update((all) => ({ ...all, wills: true }));
    TestBed.tick();

    expect(stored()).toEqual({ deeds: true, wills: true });
  });

  it('ignores the values of other keys', () => {
    const marks = createMarks();
    marks.set({ deeds: true });
    TestBed.tick();

    saveInOtherTab('nc.other', { wills: true });

    expect(marks()).toEqual({ deeds: true });
  });
});
