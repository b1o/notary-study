import { httpResource } from '@angular/common/http';
import { computed, Service } from '@angular/core';

import type { GlossaryTerm } from '../content/content.models';
import { slugify } from '../text/slug';

/** Fragment id of a term on the glossary page, for links from search: "term-нотариален-акт". */
export const termAnchor = (term: GlossaryTerm) => `term-${slugify(term.bg)}`;

/** The glossary: Bulgarian terms with an English equivalent, a definition and the law behind them. */
@Service()
export class GlossaryService {
  readonly resource = httpResource<readonly GlossaryTerm[]>(() => 'data/glossary.json');

  /** The terms in Bulgarian alphabetical order. */
  readonly terms = computed<readonly GlossaryTerm[]>(() =>
    this.resource.hasValue()
      ? [...this.resource.value()].sort((a, b) => a.bg.localeCompare(b.bg, 'bg'))
      : [],
  );
}
