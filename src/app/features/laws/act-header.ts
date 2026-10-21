import { Component, inject, input } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import type { LawCatalogEntry } from '../../core/laws/law.models';
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
}
