import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import type { GlossaryTerm } from '../../core/content/content.models';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { GlossaryService } from '../../core/reference/glossary.service';
import { foldText } from '../../core/text/fold';
import { GlossaryList } from '../../shared/course/glossary-list';
import { StickyBar } from '../../shared/dom/sticky-bar';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';

/** The glossary: all terms by initial letter, with a filter. */
@Component({
  selector: 'nc-glossary-page',
  imports: [RouterLink, FormField, PageLayout, PageHeader, GlossaryList, LoadStatus, StickyBar],
  templateUrl: './glossary-page.html',
  styleUrl: './glossary-page.scss',
})
export default class GlossaryPage {
  protected readonly glossary = inject(GlossaryService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly filter = form(signal(''));

  /** The terms that match the filter, grouped by their initial letter. */
  protected readonly groups = computed(() => {
    const query = foldText(this.filter().value().trim());
    const language = this.lang();
    const groups: { letter: string; terms: GlossaryTerm[] }[] = [];
    for (const term of this.glossary.terms()) {
      const text = foldText(`${term.bg} ${term.en} ${term.definition[language]}`);
      if (query && !text.includes(query)) continue;
      const letter = term.bg.charAt(0).toUpperCase();
      const last = groups.at(-1);
      if (last?.letter === letter) last.terms.push(term);
      else groups.push({ letter, terms: [term] });
    }
    return groups;
  });

  constructor() {
    pageTitleEffect(() => this.ui().nav.glossary);
  }
}
