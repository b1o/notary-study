import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** One heading of a page, linked by its fragment id. */
export interface OutlineItem {
  readonly id: string;
  readonly title: string;
  /** A muted prefix, for example "Глава първа". */
  readonly label?: string;
  /** 0 for the outermost headings; each step indents the item. */
  readonly depth: number;
  /** The title is in capital letters, as many law titles are: it gets a smaller size. */
  readonly caps?: boolean;
}

/** The headings of the current page as links: the contents of a chapter or of an act. */
@Component({
  selector: 'nc-outline-list',
  imports: [RouterLink],
  template: `
    <ol class="row-list outline">
      @for (item of items(); track item.id) {
        <li [style.--depth]="item.depth">
          <a
            class="row-link row-link--compact outline__link"
            [routerLink]="[]"
            [fragment]="item.id"
          >
            @if (item.label) {
              <span class="outline__label">{{ item.label }}</span
              >&ngsp;
            }
            <span [class.outline__caps]="item.caps">{{ item.title }}</span>
          </a>
        </li>
      }
    </ol>
  `,
  styleUrl: './outline-list.scss',
})
export class OutlineList {
  readonly items = input.required<readonly OutlineItem[]>();
}
