import { Component, inject, input } from '@angular/core';

import { parseReference } from '../../core/laws/citation';
import { LawLibraryService } from '../../core/laws/law-library.service';
import { LawPanelService } from '../../core/laws/law-panel.service';
import { isPlainClick } from './citation-click';

/**
 * Law references from the data (glossary, templates, tests) as citation pills, like the
 * citations in the course text: a click opens the provision in the law panel.
 */
@Component({
  selector: 'nc-law-refs',
  template: `
    @for (ref of refs(); track ref) {
      <a
        class="cite"
        [class.cite--active]="panel.isShown(parse(ref))"
        [attr.aria-current]="panel.isShown(parse(ref)) ? 'true' : null"
        [href]="laws.url(ref)"
        (click)="open($event, ref)"
        >{{ laws.label(ref) }}</a
      >&ngsp;
    }
  `,
  host: { class: 'law-refs' },
})
export class LawRefs {
  /** References such as "znnd:25:9". */
  readonly refs = input.required<readonly string[]>();

  protected readonly laws = inject(LawLibraryService);
  protected readonly panel = inject(LawPanelService);
  protected readonly parse = parseReference;

  protected open(event: MouseEvent, ref: string): void {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    this.panel.open(parseReference(ref));
  }
}
