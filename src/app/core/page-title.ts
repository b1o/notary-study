import { effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { LanguageService } from './i18n/language.service';

/**
 * Keep the document title in sync with a page: "Notarial deeds | Notary course".
 * Call it in a page component's constructor or field initializer. Without a page title,
 * the document title is the app name.
 */
export function pageTitleEffect(pageTitle: () => string | undefined): void {
  const title = inject(Title);
  const language = inject(LanguageService);
  effect(() => {
    const appName = language.text().app.name;
    const page = pageTitle();
    title.setTitle(page ? `${page} | ${appName}` : appName);
  });
}
