import { Component, computed, inject, output, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

import { APP_SECTIONS } from '../../app-sections';
import { ContentService } from '../../core/content/content.service';
import { LANGUAGES, type Language } from '../../core/i18n/language';
import { LanguageService } from '../../core/i18n/language.service';
import { ProgressService } from '../../core/progress/progress.service';
import { ChoiceGroup, type Choice } from '../../shared/ui/choice-group';
import { Icon } from '../../shared/ui/icon';
import { SearchBox } from '../../shared/ui/search-box';
import { ReadingSettingsPanel } from '../reading-settings/reading-settings-panel';

/** The main navigation: tools, the chapters by part, the language and the reading settings. */
@Component({
  selector: 'nc-side-nav',
  imports: [RouterLink, RouterLinkActive, Icon, ChoiceGroup, ReadingSettingsPanel, SearchBox],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {
  /** On small screens the navigation covers the page; this asks the app to close it. */
  readonly closeMenu = output();

  private readonly searchBox = viewChild.required(SearchBox);

  private readonly router = inject(Router);
  protected readonly content = inject(ContentService);
  protected readonly progress = inject(ProgressService);
  protected readonly language = inject(LanguageService);
  protected readonly ui = this.language.text;
  protected readonly lang = this.language.current;

  protected readonly groups = (['reference', 'study'] as const).map((label) => ({
    label,
    items: APP_SECTIONS.filter((section) => section.group === label),
  }));

  protected readonly languageChoices = computed<Choice<Language>[]>(() =>
    LANGUAGES.map((language) => ({ value: language, label: this.ui().language[language] })),
  );

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** The part of the open chapter. Its list starts expanded. */
  protected readonly currentPart = computed(() => {
    const match = /^\/course\/([^/?#]+)/.exec(this.url());
    return match ? this.content.chapter(decodeURIComponent(match[1]))?.part : undefined;
  });

  focusSearch(): void {
    this.searchBox().focus();
  }
}
