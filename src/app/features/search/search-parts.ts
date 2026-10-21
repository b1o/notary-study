import { Component, inject, input } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import type { Snippet } from '../../core/search/search';

/** A group of results under its heading, with a note when the list shows only the best. */
@Component({
  selector: 'nc-search-group',
  template: `
    <h2 class="section-title">{{ heading() }}</h2>
    <ng-content />
    @if (total() > shown()) {
      <p class="search-group__more">{{ ui().search.moreResults(total() - shown()) }}</p>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .search-group__more {
      margin: var(--space-3) 0 0;
      font-size: var(--text-sm);
      color: var(--color-ink-2);
    }
  `,
})
export class SearchGroup {
  readonly heading = input.required<string>();
  readonly shown = input(0);
  readonly total = input(0);
  protected readonly ui = inject(LanguageService).text;
}

/** The text around a match, with the match marked, in the language of the text. */
@Component({
  selector: 'nc-search-snippet',
  // Inline content only: a line break here would put a space around the match.
  template: `{{ snippet().before }}<mark>{{ snippet().match }}</mark
    >{{ snippet().after }}`,
  host: { '[attr.lang]': 'snippet().language' },
  styles: `
    :host {
      display: block;
      /* The text lines up with the text of the row link above (see .row-link). */
      padding-block-end: var(--space-2);
      font-size: var(--text-sm);
      line-height: 1.55;
      color: var(--color-ink-2);
    }
    mark {
      border-radius: 2px;
      background: var(--color-accent-soft);
      color: var(--color-ink-strong);
    }
  `,
})
export class SearchSnippet {
  readonly snippet = input.required<Snippet>();
}
