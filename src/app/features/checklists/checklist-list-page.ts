import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { ChecklistsService } from '../../core/reference/checklists.service';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { Notice } from '../../shared/ui/notice';

/** All checklists: examples of a typical flow for common transactions. */
@Component({
  selector: 'nc-checklist-list-page',
  imports: [RouterLink, PageLayout, PageHeader, LoadStatus, Notice],
  template: `
    @let text = ui();
    <nc-page-layout main="reading">
      <nc-page-header pageHeader [heading]="text.nav.checklists" [lead]="text.checklists.lead">
        <nc-notice class="header-note">{{ text.checklists.exampleNote }}</nc-notice>
      </nc-page-header>

      <nc-load-status [resource]="checklists.resource" />

      @if (checklists.resource.hasValue()) {
        <ul class="row-list">
          @for (checklist of checklists.resource.value(); track checklist.id) {
            <li>
              <a class="row-link" [routerLink]="['/checklists', checklist.id]">
                <span class="row-link__title">{{ checklist.title[lang()] }}</span>
                <span class="row-link__detail">{{ checklist.when[lang()] }}</span>
              </a>
            </li>
          }
        </ul>
      }
    </nc-page-layout>
  `,
})
export default class ChecklistListPage {
  protected readonly checklists = inject(ChecklistsService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  constructor() {
    pageTitleEffect(() => this.ui().nav.checklists);
  }
}
