import { Component, inject, input } from '@angular/core';
import type { WritableResource } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';

/** The loading and error states of a resource. It shows nothing when the data is there. */
@Component({
  selector: 'nc-load-status',
  template: `
    @if (resource().error()) {
      <div class="load-status load-status--error" role="alert">
        <p>{{ ui().common.loadError }}</p>
        <button type="button" class="button" (click)="resource().reload()">
          {{ ui().common.retry }}
        </button>
      </div>
    } @else if (resource().isLoading()) {
      <p class="load-status load-status--loading" role="status">
        {{ loadingText() ?? ui().common.loading }}
      </p>
    }
  `,
  styles: `
    .load-status {
      margin: 0;
      padding: var(--space-5) 0;
      color: var(--color-ink-2);
    }
    .load-status p {
      margin: 0 0 var(--space-3);
    }
    /* Local data usually arrives at once: show "Loading" only when it takes a moment. */
    .load-status--loading {
      animation: appear 0s 300ms both;
    }
    @keyframes appear {
      from {
        visibility: hidden;
      }
    }
  `,
})
export class LoadStatus {
  readonly resource =
    input.required<Pick<WritableResource<unknown>, 'error' | 'isLoading' | 'reload'>>();
  /** What the reader waits for, when "Loading…" says too little. */
  readonly loadingText = input<string>();
  protected readonly ui = inject(LanguageService).text;
}
