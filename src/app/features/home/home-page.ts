import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_SECTIONS } from '../../app-sections';
import type { ChapterMeta } from '../../core/content/content.models';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { pageTitleEffect } from '../../core/page-title';
import { ProgressService } from '../../core/progress/progress.service';
import { oneOf, storedSignal } from '../../core/storage/stored-signal';
import { ChapterList, ChapterRowEnd } from '../../shared/course/chapter-list';
import { PageHeader } from '../../shared/layout/page-header';
import { PageLayout } from '../../shared/layout/page-layout';
import { ChoiceGroup, toChoices } from '../../shared/ui/choice-group';
import { Icon } from '../../shared/ui/icon';
import { LoadStatus } from '../../shared/ui/load-status';

const ROLE_FILTERS = ['all', 'clerk', 'assistant', 'notary'] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];

/** The start page: where to continue, the reference tools and all chapters. */
@Component({
  selector: 'nc-home-page',
  imports: [
    RouterLink,
    PageLayout,
    PageHeader,
    ChapterList,
    ChapterRowEnd,
    ChoiceGroup,
    Icon,
    LoadStatus,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export default class HomePage {
  protected readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  private readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;
  protected readonly sections = APP_SECTIONS;
  protected readonly chapterLink = (chapter: ChapterMeta) => ['/course', chapter.id];

  protected readonly roleFilter = storedSignal<RoleFilter>(
    'nc.home.role',
    'all',
    oneOf(ROLE_FILTERS),
  );
  protected readonly roleChoices = computed(() => toChoices(ROLE_FILTERS, this.ui().roles));

  /** The parts with the chapters that the role filter lets through. Empty parts are left out. */
  protected readonly parts = computed(() => {
    const role = this.roleFilter();
    if (role === 'all') return this.content.outline();
    return this.content
      .outline()
      .map((group) => ({
        ...group,
        chapters: group.chapters.filter((chapter) => chapter.roles.includes(role)),
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
