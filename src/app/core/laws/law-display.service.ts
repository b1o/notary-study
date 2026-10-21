import { Service } from '@angular/core';

import { oneOf, storedSignal } from '../storage/stored-signal';

export const LAW_TEXT_LANGUAGES = ['bg', 'en', 'both'] as const;
export type LawTextLanguage = (typeof LAW_TEXT_LANGUAGES)[number];

/** How law texts are shown, in the law panel and in the library. Saved in the browser. */
@Service()
export class LawDisplayService {
  /** "both" shows the Bulgarian text, and the English translation when there is one. */
  readonly textLanguage = storedSignal<LawTextLanguage>(
    'nc.law.textLanguage',
    'both',
    oneOf(LAW_TEXT_LANGUAGES),
  );

  /** Amendment notes, for example "(Изм. - ДВ, бр. 18 от 2003 г.)". */
  readonly hideAmendments = storedSignal<boolean>(
    'nc.law.hideAmendments',
    false,
    (stored, fallback) => (typeof stored === 'boolean' ? stored : fallback),
  );
}
