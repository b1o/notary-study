import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { LanguageService } from './core/i18n/language.service';
import { LawPanelService } from './core/laws/law-panel.service';
import { ReadingSettingsService } from './core/settings/reading-settings.service';
import { LawPanel } from './layout/law-panel/law-panel';
import { SideNav } from './layout/side-nav/side-nav';
import { Icon } from './shared/ui/icon';

/** The app frame: navigation on the left, the page in the middle, the law panel on the right. */
@Component({
  selector: 'nc-root',
  imports: [RouterOutlet, RouterLink, SideNav, LawPanel, Icon],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: {
    '[class.app--panel-open]': 'panel.isOpen()',
    '[style.--panel-width.px]': 'panel.width()',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class App {
  protected readonly ui = inject(LanguageService).text;
  protected readonly panel = inject(LawPanelService);

  /** The navigation drawer on small screens. */
  protected readonly menuOpen = signal(false);

  constructor() {
    // Created here, so that the saved reading settings apply to <html> before the first page shows.
    inject(ReadingSettingsService);

    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }
}
