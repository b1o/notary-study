import { computed, inject, Service } from '@angular/core';

import { isLanguage, type Language } from '../i18n/language';
import { LanguageService } from '../i18n/language.service';
import { storedSignal } from '../storage/stored-signal';

/** How law texts are shown, in the law panel and in the library. Saved in the browser. */
@Service()
export class LawDisplayService {
  private readonly interfaceLanguage = inject(LanguageService).current;

  /**
   * The language that the reader chose for law texts; null before a choice. An older version
   * also offered "both"; a stored "both" counts as no choice.
   */
  private readonly chosenLanguage = storedSignal<Language | null>(
    'nc.law.textLanguage',
    null,
    (stored, fallback) => (isLanguage(stored) ? stored : fallback),
  );

  /**
   * The language of law texts: the reader's choice, else the language of the interface.
   * An article without an English translation shows in Bulgarian.
   */
  readonly textLanguage = computed(() => this.chosenLanguage() ?? this.interfaceLanguage());

  chooseTextLanguage(language: Language): void {
    this.chosenLanguage.set(language);
  }

  /** Amendment notes, for example "(Изм. - ДВ, бр. 18 от 2003 г.)". */
  readonly hideAmendments = storedSignal<boolean>(
    'nc.law.hideAmendments',
    false,
    (stored, fallback) => (typeof stored === 'boolean' ? stored : fallback),
  );
}
