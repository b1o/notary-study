import { HttpClient } from '@angular/common/http';
import { computed, inject, resource, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { GlossaryTerm } from '../content/content.models';
import { PromiseCache } from '../data/promise-cache';
import { slugify } from '../text/slug';

/** Fragment id of a term on the glossary page, for links from search: "term-нотариален-акт". */
export const termAnchor = (term: GlossaryTerm) => `term-${slugify(term.bg)}`;

/** The glossary: Bulgarian terms with an English equivalent, a definition and the law behind them. */
@Service()
export class GlossaryService {
  private readonly http = inject(HttpClient);
  private readonly cache = new PromiseCache<readonly GlossaryTerm[]>();

  /** The terms in Bulgarian alphabetical order, for code that works with promises. */
  load(): Promise<readonly GlossaryTerm[]> {
    return this.cache.get('glossary', async () => {
      const terms = await firstValueFrom(this.http.get<GlossaryTerm[]>('data/glossary.json'));
      return terms.sort((a, b) => a.bg.localeCompare(b.bg, 'bg'));
    });
  }

  readonly resource = resource({ loader: () => this.load() });

  /** The terms in Bulgarian alphabetical order; empty until they arrive. */
  readonly terms = computed<readonly GlossaryTerm[]>(() =>
    this.resource.hasValue() ? this.resource.value() : [],
  );
}
