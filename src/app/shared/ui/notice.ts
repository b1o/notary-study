import { Component, input } from '@angular/core';

/**
 * A short note in a tinted box: "info" for background facts (for example that a law text is
 * unofficial), "warn" for something the reader must check. The content is text or paragraphs;
 * the spacing of paragraphs inside is in src/styles/_components.scss.
 */
@Component({
  selector: 'nc-notice',
  template: '<ng-content />',
  host: {
    '[class]': "'notice notice--' + tone()",
    '[attr.role]': "tone() === 'warn' ? 'status' : null",
  },
  styles: `
    :host {
      display: block;
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
    }
    :host(.notice--info) {
      background: var(--color-surface-2);
      color: var(--color-ink-2);
    }
    :host(.notice--warn) {
      background: var(--color-warn-soft);
      color: var(--color-warn);
    }
  `,
})
export class Notice {
  readonly tone = input<'info' | 'warn'>('info');
}
