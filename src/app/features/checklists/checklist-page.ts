import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { findCitations } from '../../core/laws/citation';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { ChecklistsService } from '../../core/reference/checklists.service';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { MarkdownContent } from '../../shared/ui/markdown-content';
import { Notice } from '../../shared/ui/notice';
import { PrintButton } from '../../shared/ui/print-button';

/**
 * One checklist: an example of what an office asks for and checks, by section. An item that cites
 * no provision is marked, so the reader knows that no source backs it here.
 */
@Component({
  selector: 'nc-checklist-page',
  imports: [
    RouterLink,
    PageLayout,
    PageHeader,
    MissingPage,
    MarkdownContent,
    Notice,
    PrintButton,
    LoadStatus,
  ],
  templateUrl: './checklist-page.html',
  styleUrl: './checklist-page.scss',
})
export default class ChecklistPage {
  /** From the route: checklists/:checklistId */
  readonly checklistId = input.required<string>();

  protected readonly checklists = inject(ChecklistsService);
  private readonly content = inject(ContentService);
  private readonly markdown = inject(MarkdownService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly checklist = computed(() => this.checklists.checklist(this.checklistId()));
  protected readonly chapter = computed(() => {
    const chapterId = this.checklist()?.chapter;
    return chapterId ? this.content.chapter(chapterId) : undefined;
  });

  /** The sections with each item rendered, and whether a cited provision requires the item. */
  protected readonly sections = computed(() => {
    const language = this.lang();
    return (this.checklist()?.sections ?? []).map((section) => ({
      title: section.title[language],
      items: section.items.map((item) => ({
        html: this.markdown.renderInline(item[language]),
        sourced: findCitations(item[language]).length > 0,
      })),
    }));
  });

  /** The checklists are there, but none has this id. */
  protected readonly missing = computed(
    () => this.checklists.resource.hasValue() && !this.checklist(),
  );

  constructor() {
    pageTitleEffect(() => this.checklist()?.title[this.lang()]);
  }
}
