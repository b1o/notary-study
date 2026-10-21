import { Component, DOCUMENT, inject } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import { Icon } from './icon';

/** Prints the page. The print styles (src/styles/_print.scss) leave out the app frame. */
@Component({
  selector: 'nc-print-button',
  imports: [Icon],
  template: `
    <button type="button" class="button button--quiet" (click)="print()">
      <nc-icon name="print" />{{ ui().common.print }}
    </button>
  `,
})
export class PrintButton {
  protected readonly ui = inject(LanguageService).text;
  private readonly window = inject(DOCUMENT).defaultView;

  protected print(): void {
    this.window?.print();
  }
}
