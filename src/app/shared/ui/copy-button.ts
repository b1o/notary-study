import { Component, inject, input, signal } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import { Icon } from './icon';

/** How long the button says "Copied" after a copy, in milliseconds. */
const CONFIRMATION_TIME = 2000;

/** A button that copies a text to the clipboard and says so for a moment. */
@Component({
  selector: 'nc-copy-button',
  imports: [Icon],
  template: `
    <button type="button" class="button" (click)="copy()">
      <nc-icon [name]="copied() ? 'check' : 'copy'" />
      <span aria-live="polite">{{ copied() ? ui().common.copied : ui().common.copy }}</span>
    </button>
  `,
})
export class CopyButton {
  readonly text = input.required<string>();

  protected readonly ui = inject(LanguageService).text;
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.text());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), CONFIRMATION_TIME);
  }
}
