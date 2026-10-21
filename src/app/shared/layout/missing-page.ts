import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { PageHeader } from './page-header';
import { PageLayout } from './page-layout';

/** The page for an address that leads nowhere: an unknown route, chapter, act or template. */
@Component({
  selector: 'nc-missing-page',
  imports: [PageLayout, PageHeader, RouterLink],
  template: `
    <nc-page-layout>
      <nc-page-header pageHeader [heading]="ui().common.notFound" />
      <a class="button" routerLink="/">{{ ui().common.goHome }}</a>
    </nc-page-layout>
  `,
})
export class MissingPage {
  protected readonly ui = inject(LanguageService).text;
}
