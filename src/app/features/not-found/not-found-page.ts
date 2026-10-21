import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';

/** Any URL that no route matches. */
@Component({
  selector: 'nc-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page">
      <h1 class="page-title">{{ ui().common.notFound }}</h1>
      <p>
        <a routerLink="/">{{ ui().common.goHome }}</a>
      </p>
    </div>
  `,
})
export default class NotFoundPage {
  protected readonly ui = inject(LanguageService).text;

  constructor() {
    pageTitleEffect(() => this.ui().common.notFound);
  }
}
