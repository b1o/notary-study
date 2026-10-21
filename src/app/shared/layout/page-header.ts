import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../ui/icon';

/** A link to the page above this one, for example from a chapter test back to the chapter. */
export interface BackLink {
  readonly label: string;
  readonly link: string | readonly unknown[];
}

/**
 * The top of a page: an optional link back, the title (the page's h1), any extra lines
 * (projected content, for example dates or the chapter number) and an optional lead paragraph.
 * Put it in the pageHeader slot of nc-page-layout.
 */
@Component({
  selector: 'nc-page-header',
  imports: [RouterLink, Icon],
  template: `
    @if (back(); as back) {
      <a class="page-header__back" [routerLink]="back.link">
        <nc-icon name="arrowLeft" />{{ back.label }}
      </a>
    }
    <h1 class="page-header__title" [attr.lang]="headingLang() ?? null">{{ heading() }}</h1>
    <ng-content />
    @if (lead()) {
      <p class="page-header__lead">{{ lead() }}</p>
    }
  `,
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly heading = input.required<string>();
  /** Language of the title when it differs from the page, for example a Bulgarian title in English. */
  readonly headingLang = input<string>();
  readonly lead = input<string>();
  readonly back = input<BackLink>();
}
