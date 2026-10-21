import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import type { UiText } from '../../core/i18n/ui-text';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { oneOf, storedSignal } from '../../core/storage/stored-signal';
import { ChoiceGroup, toChoices } from '../../shared/ui/choice-group';
import { Icon, type IconName } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';

const ROLE_FILTERS = ['all', 'clerk', 'assistant', 'notary'] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];

interface Tool {
  readonly title: keyof UiText['nav'];
  readonly hint: keyof UiText['home'];
  readonly icon: IconName;
  /** Tools without a path are not in the Angular version yet. */
  readonly path?: string;
}

const TOOLS: readonly Tool[] = [
  { title: 'laws', hint: 'lawsHint', icon: 'law', path: '/laws' },
  { title: 'glossary', hint: 'glossaryHint', icon: 'glossary' },
  { title: 'templates', hint: 'templatesHint', icon: 'template' },
  { title: 'checklists', hint: 'checklistsHint', icon: 'checklist' },
  { title: 'fees', hint: 'feesHint', icon: 'calculator' },
  { title: 'tests', hint: 'testsHint', icon: 'test' },
];

/** The start page: where to continue, the reference tools and all chapters. */
@Component({
  selector: 'nc-home-page',
  imports: [RouterLink, ChoiceGroup, Icon, LoadStatus],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export default class HomePage {
  protected readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;
  protected readonly tools = TOOLS;

  protected readonly roleFilter = storedSignal<RoleFilter>(
    'nc.home.role',
    'all',
    oneOf(ROLE_FILTERS),
  );
  protected readonly roleChoices = computed(() => toChoices(ROLE_FILTERS, this.ui().roles));

  /** The parts with the chapters that the role filter lets through. Empty parts are left out. */
  protected readonly parts = computed(() => {
    const role = this.roleFilter();
    return this.content
      .parts()
      .map((part, index) => ({
        part,
        number: index + 1,
        chapters: this.content
          .chaptersOf(part)
          .filter((chapter) => role === 'all' || chapter.roles.includes(role)),
      }))
      .filter((group) => group.chapters.length > 0);
  });

  /** The chapter to continue with: the last one opened, or the first one. */
  protected readonly nextChapter = computed(() => {
    const last = this.progress.lastChapter();
    const chapter = last ? this.content.chapter(last) : undefined;
    return chapter ?? this.content.chapters()[0];
  });

  constructor() {
    pageTitleEffect(() => undefined);
  }
}
