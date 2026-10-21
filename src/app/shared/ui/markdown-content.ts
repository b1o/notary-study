import { afterRenderEffect, Component, ElementRef, inject, input } from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';

import { articleKey, parseReference } from '../../core/laws/citation';
import { LawPanelService } from '../../core/laws/law-panel.service';

/**
 * Shows rendered course Markdown (see MarkdownService). A click on a law citation opens the
 * provision in the law panel; Ctrl/Cmd-click or middle click opens the law library in a new tab.
 * The citation that the panel shows gets the class "cite--active".
 */
@Component({
  selector: 'nc-markdown-content',
  template: '',
  host: {
    class: 'prose',
    '[innerHTML]': 'content()',
    '(click)': 'openCitation($event)',
  },
})
export class MarkdownContent {
  readonly content = input.required<SafeHtml>();

  private readonly panel = inject(LawPanelService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  constructor() {
    afterRenderEffect(() => {
      this.content();
      const current = this.panel.current();
      for (const link of this.host.nativeElement.querySelectorAll<HTMLAnchorElement>('a.cite')) {
        const reference = parseReference(link.dataset['ref'] ?? '');
        const active =
          !!current &&
          articleKey(reference) === articleKey(current) &&
          reference.paragraph === current.paragraph;
        link.classList.toggle('cite--active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    });
  }

  protected openCitation(event: MouseEvent): void {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a.cite');
    if (
      !link ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    this.panel.open(parseReference(link.dataset['ref'] ?? ''));
  }
}
