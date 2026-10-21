import { TestBed } from '@angular/core/testing';

import { DEFAULT_READING_SETTINGS } from './reading-settings';
import { ReadingSettingsService } from './reading-settings.service';

describe('ReadingSettingsService', () => {
  beforeEach(() => localStorage.clear());

  it('applies the settings as attributes on <html>', () => {
    const settings = TestBed.inject(ReadingSettingsService);
    settings.values.update((values) => ({ ...values, theme: 'dark', textSize: 'large' }));
    TestBed.tick();

    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('dark');
    expect(root.dataset['textSize']).toBe('large');
  });

  it('leaves out data-theme for the system theme', () => {
    TestBed.inject(ReadingSettingsService);
    TestBed.tick();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('keeps the valid stored values and replaces the others with defaults', () => {
    localStorage.setItem('nc.reading', JSON.stringify({ textSize: 'larger', theme: 'purple' }));
    const settings = TestBed.inject(ReadingSettingsService);
    expect(settings.values()).toEqual({ ...DEFAULT_READING_SETTINGS, textSize: 'larger' });
  });
});
