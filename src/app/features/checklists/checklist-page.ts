import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { MarkdownService } from '../../core/markdown/markdown.service';
import { pageTitleEffect } from '../../core/page-title';
import { ChecklistsService } from '../../core/reference/checklists.service';
import { MissingPage } from '../../shared/layout/missing-page';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { LoadStatus } from '../../shared/ui/load-status';
import { MarkdownContent } from '../../shared/ui/markdown-content';
import { PrintButton } from '../../shared/ui/print-button';

/** One checklist: its sections with items to tick. The ticks stay in the browser. */
@Component({
  selector: 'nc-checklist-page',
  imports: [
    RouterLink,
    PageLayout,
    PageHeader,
    MissingPage,
    MarkdownContent,
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

  /** The sections with each item rendered, and the key under which its tick is kept. */
  protected readonly sections = computed(() => {
    const language = this.lang();
    return (this.checklist()?.sections ?? []).map((section, s) => ({
      title: section.title[language],
      items: section.items.map((item, i) => ({
        key: `${s}.${i}`,
        html: this.markdown.renderInline(item[language]),
      })),
    }));
  });

  protected readonly progress = computed(() => {
    const id = this.checklistId();
    const keys = this.sections().flatMap((section) => section.items.map((item) => item.key));
    const ticked = keys.filter((key) => this.checklists.isTicked(id, key)).length;
    return this.ui().checklists.progress(ticked, keys.length);
  });

  /** The checklists are there, but none has this id. */
  protected readonly missing = computed(
    () => this.checklists.resource.hasValue() && !this.checklist(),
  );

  constructor() {
    pageTitleEffect(() => this.checklist()?.title[this.lang()]);
  }

  protected toggle(key: string, event: Event): void {
    const ticked = (event.target as HTMLInputElement).checked;
    this.checklists.setTicked(this.checklistId(), key, ticked);
  }
}
