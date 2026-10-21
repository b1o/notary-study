import { Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import { gazetteIssue, inForceDate } from '../../core/laws/act-dates';
import type { LawCatalogEntry } from '../../core/laws/law.models';
import { formatLongDate, hostOf } from '../../core/text/format';
import { PageHeader } from '../../shared/layout/page-header';
import { Notice } from '../../shared/ui/notice';

/** The top of an act page: title, abbreviation, dates, source and notes about the text. */
@Component({
  selector: 'nc-act-header',
  imports: [PageHeader, Notice],
  templateUrl: './act-header.html',
  styleUrl: './act-header.scss',
})
export class ActHeader {
  readonly entry = input.required<LawCatalogEntry>();

  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  /** The dates from the notes of lex.bg, written in the language of the page. */
  protected readonly inForce = computed(() => inForceDate(this.entry().inForce));
  protected readonly lastIssue = computed(() => gazetteIssue(this.entry().lastChange));
  /** The site the text comes from: lex.bg for imported acts, the publisher for hand-made ones. */
  protected readonly sourceHost = computed(() => hostOf(this.entry().source));

  protected date(iso: string): string {
    return formatLongDate(iso, this.lang());
  }
}
