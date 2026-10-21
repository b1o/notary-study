import {
  afterRenderEffect,
  booleanAttribute,
  Component,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import type { SafeHtml } from '@angular/platform-browser';

import { parseReference } from '../../core/laws/citation';
import { LawPanelService } from '../../core/laws/law-panel.service';
import { isPlainClick } from '../law/citation-click';

/**
 * Shows rendered course Markdown (see MarkdownService). A click on a law citation opens the
 * provision in the law panel; Ctrl/Cmd-click or middle click opens the law library in a new tab.
 * The citation that the panel shows gets the class "cite--active".
 * With `inline`, the content is one line of text (MarkdownService.renderInline) without prose styles.
 */
@Component({
  selector: 'nc-markdown-content',
  template: '',
  host: {
    '[class.prose]': '!inline()',
    '[style.display]': "inline() ? 'inline' : null",
    '[innerHTML]': 'content()',
    '(click)': 'openCitation($event)',
  },
})
export class MarkdownContent {
  readonly content = input.required<SafeHtml>();
  readonly inline = input(false, { transform: booleanAttribute });

  private readonly panel = inject(LawPanelService);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);

  constructor() {
    afterRenderEffect(() => {
      this.content();
      this.panel.current();
      for (const link of this.host.nativeElement.querySelectorAll<HTMLAnchorElement>('a.cite')) {
        const active = this.panel.isShown(parseReference(link.dataset['ref'] ?? ''));
        link.classList.toggle('cite--active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
    });
  }

  protected openCitation(event: MouseEvent): void {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a.cite');
    if (!link || !isPlainClick(event)) return;
    event.preventDefault();
    this.panel.open(parseReference(link.dataset['ref'] ?? ''));
  }
}
