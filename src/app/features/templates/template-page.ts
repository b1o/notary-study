import { Component, computed, inject, input } from '@angular/core';

import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { TemplatesService } from '../../core/reference/templates.service';
import { LawRefs } from '../../shared/law/law-refs';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { CopyButton } from '../../shared/ui/copy-button';
import { LoadStatus } from '../../shared/ui/load-status';
import { MarkdownContent } from '../../shared/ui/markdown-content';
import { Notice } from '../../shared/ui/notice';
import { PrintButton } from '../../shared/ui/print-button';

/** One document template: the Bulgarian text as a sheet, the notes and the English translation. */
@Component({
  selector: 'nc-template-page',
  imports: [
    PageLayout,
    PageHeader,
    MissingPage,
    LawRefs,
    CopyButton,
    PrintButton,
    MarkdownContent,
    Notice,
    LoadStatus,
  ],
  templateUrl: './template-page.html',
  styleUrl: './template-page.scss',
})
export default class TemplatePage {
  /** From the route: templates/:templateId */
  readonly templateId = input.required<string>();

  protected readonly templates = inject(TemplatesService);
  private readonly markdown = inject(MarkdownService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly template = computed(() => this.templates.template(this.templateId()));
  protected readonly notes = computed(() => {
    const template = this.template();
    return template && this.markdown.render(template.notes[this.lang()]).html;
  });
  /** The templates are there, but none has this id. */
  protected readonly missing = computed(
    () => this.templates.resource.hasValue() && !this.template(),
  );

  constructor() {
    pageTitleEffect(() => this.template()?.title[this.lang()]);
  }
}
