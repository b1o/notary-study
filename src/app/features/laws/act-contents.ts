import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { ActHeadingEntry } from './act-entries';

/** The list of chapters and sections of an act, with links to them. */
@Component({
  selector: 'nc-act-contents',
  imports: [RouterLink],
  template: `
    <ol class="act-contents" lang="bg">
      @for (heading of headings(); track heading.id) {
        <li [style.--depth]="heading.level - 1">
          <a [routerLink]="[]" [fragment]="heading.id">
            @if (heading.parts.label) {
              <span class="act-contents__label">{{ heading.parts.label }}</span
              >&ngsp;
            }
            <span [class.act-contents__caps]="heading.parts.caps">{{ heading.parts.title }}</span>
          </a>
        </li>
      }
    </ol>
  `,
  styleUrl: './act-contents.scss',
})
export class ActContents {
  readonly headings = input.required<readonly ActHeadingEntry[]>();
}
