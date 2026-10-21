import { computed, DOCUMENT, effect, inject, Service } from '@angular/core';

import { storedSignal } from '../storage/stored-signal';
import { isLanguage, type Language, type Localized } from './language';
import type { UiText } from './ui-text';
import { UI_TEXT_BG } from './ui-text.bg';
import { UI_TEXT_EN } from './ui-text.en';

const UI_TEXT: Readonly<Record<Language, UiText>> = { bg: UI_TEXT_BG, en: UI_TEXT_EN };

/** The interface language. It also decides which language of the course content is shown. */
@Service()
export class LanguageService {
  private readonly document = inject(DOCUMENT);

  readonly current = storedSignal<Language>('nc.language', this.browserLanguage(), (stored, fallback) =>
    isLanguage(stored) ? stored : fallback,
  );

  /** All interface texts in the current language. */
  readonly text = computed(() => UI_TEXT[this.current()]);

  constructor() {
    effect(() => (this.document.documentElement.lang = this.current()));
  }

  /** The current language's value of a bilingual value. */
  pick<T>(value: Localized<T>): T {
    return value[this.current()];
  }

  private browserLanguage(): Language {
    const preferred = this.document.defaultView?.navigator.language ?? '';
    return preferred.toLowerCase().startsWith('bg') ? 'bg' : 'en';
  }
}
