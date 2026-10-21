import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { TemplatesService } from '../../core/reference/templates.service';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { Notice } from '../../shared/ui/notice';

/** All document templates, by group. */
@Component({
  selector: 'nc-template-list-page',
  imports: [RouterLink, PageLayout, PageHeader, Notice, LoadStatus],
  template: `
    @let text = ui();
    <nc-page-layout>
      <nc-page-header pageHeader [heading]="text.nav.templates" [lead]="text.templates.lead">
        <nc-notice class="templates-note">{{ text.templates.note }}</nc-notice>
      </nc-page-header>

      <nc-load-status [resource]="templates.resource" />

      <div class="section-columns">
        @for (entry of templates.groups(); track entry.group.id) {
          <section>
            <h2 class="section-title">{{ entry.group.title[lang()] }}</h2>
            <ul class="row-list">
              @for (template of entry.templates; track template.id) {
                <li>
                  <a class="row-link" [routerLink]="['/templates', template.id]">
                    <span class="row-link__title" lang="bg">{{ template.title.bg }}</span>
                    <span class="row-link__detail">
                      {{ lang() === 'en' ? template.title.en : template.use.bg }}
                    </span>
                  </a>
                </li>
              }
            </ul>
          </section>
        }
      </div>
    </nc-page-layout>
  `,
  styles: `
    .templates-note {
      max-inline-size: 42rem;
      margin-block-start: var(--space-4);
    }
  `,
})
export default class TemplateListPage {
  protected readonly templates = inject(TemplatesService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  constructor() {
    pageTitleEffect(() => this.ui().nav.templates);
  }
}
