import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { parseCitationText } from '../../core/laws/citation';
import { LawLibraryService } from '../../core/laws/law-library.service';
import { LAW_GROUPS } from '../../core/laws/law.models';
import { pageTitleEffect } from '../../core/page-title';
import { LoadStatus } from '../../shared/ui/load-status';

/** The law library: a field to open a provision by its citation, and all acts by group. */
@Component({
  selector: 'nc-law-index-page',
  imports: [RouterLink, FormField, LoadStatus],
  templateUrl: './law-index-page.html',
  styleUrl: './law-index-page.scss',
})
export default class LawIndexPage {
  protected readonly laws = inject(LawLibraryService);
  private readonly router = inject(Router);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly jump = form(signal({ citation: '' }));
  /** True after a citation that names no act of the library. */
  protected readonly jumpFailed = signal(false);

  protected readonly groups = computed(() =>
    LAW_GROUPS.map((group) => ({
      group,
      acts: this.laws.entries().filter((entry) => entry.group === group),
    })).filter(({ acts }) => acts.length > 0),
  );

  constructor() {
    pageTitleEffect(() => this.ui().law.library);
  }

  protected openCitation(event: Event): void {
    event.preventDefault();
    const reference = parseCitationText(this.jump.citation().value(), this.laws.entries());
    this.jumpFailed.set(!reference);
    if (reference) {
      const { commands, queryParams } = this.laws.link(reference);
      void this.router.navigate(commands, { queryParams });
    }
  }
}
