import { DOCUMENT, effect, inject, Service } from '@angular/core';

import { isRecord, storedSignal } from '../storage/stored-signal';
import { DEFAULT_READING_SETTINGS, READING_OPTIONS, type ReadingSettings } from './reading-settings';

/** The reader's display settings, saved in the browser and applied as data attributes on <html>. */
@Service()
export class ReadingSettingsService {
  private readonly document = inject(DOCUMENT);

  readonly values = storedSignal<ReadingSettings>('nc.reading', { ...DEFAULT_READING_SETTINGS }, restoreSettings);

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      const { theme, textSize, lineSpacing, textWidth, readingFont, motion } = this.values();
      // "system" leaves the attribute out, so the CSS media queries decide.
      setOrRemove(root, 'data-theme', theme === 'system' ? undefined : theme);
      setOrRemove(root, 'data-motion', motion === 'system' ? undefined : motion);
      root.dataset['textSize'] = textSize;
      root.dataset['lineSpacing'] = lineSpacing;
      root.dataset['textWidth'] = textWidth;
      root.dataset['readingFont'] = readingFont;
    });
  }

  reset(): void {
    this.values.set({ ...DEFAULT_READING_SETTINGS });
  }
}

function setOrRemove(element: HTMLElement, name: string, value: string | undefined): void {
  if (value === undefined) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}

/** Keep each stored value only if it is still a valid option; otherwise use the default. */
function restoreSettings(stored: unknown, fallback: ReadingSettings): ReadingSettings {
  if (!isRecord(stored)) {
    return fallback;
  }
  const valid = <K extends keyof ReadingSettings>(key: K): ReadingSettings[K] => {
    const options: readonly string[] = READING_OPTIONS[key];
    const value = stored[key];
    return typeof value === 'string' && options.includes(value) ? (value as ReadingSettings[K]) : fallback[key];
  };
  return {
    theme: valid('theme'),
    textSize: valid('textSize'),
    lineSpacing: valid('lineSpacing'),
    textWidth: valid('textWidth'),
    readingFont: valid('readingFont'),
    motion: valid('motion'),
  };
}
