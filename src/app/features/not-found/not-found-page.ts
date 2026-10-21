import { Component, inject } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { MissingPage } from '../../shared/layout/missing-page';

/** Any URL that no route matches. */
@Component({
  selector: 'nc-not-found-page',
  imports: [MissingPage],
  template: '<nc-missing-page />',
})
export default class NotFoundPage {
  private readonly ui = inject(LanguageService).text;

  constructor() {
    pageTitleEffect(() => this.ui().common.notFound);
  }
}
