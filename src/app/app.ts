import {
  afterNextRender,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
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
    '[style.--panel-width.px]': 'panel.customWidth()',
    '(document:keydown.escape)': 'menuOpen.set(false)',
    '(document:keydown)': 'focusSearch($event)',
  },
})
export class App {
  protected readonly ui = inject(LanguageService).text;
  protected readonly panel = inject(LawPanelService);

  /** The navigation drawer on small screens. */
  protected readonly menuOpen = signal(false);

  private readonly nav = viewChild.required(SideNav);
  private readonly navElement = viewChild.required(SideNav, { read: ElementRef });
  private readonly injector = inject(Injector);

  constructor() {
    // Created here, so that the saved reading settings apply to <html> before the first page shows.
    inject(ReadingSettingsService);

    // The router scrolls to a fragment with scrollTo, which ignores the scroll padding of <html>.
    // This offset is the same padding, so the target does not hide under a bar at the top.
    const root = inject(DOCUMENT).documentElement;
    inject(ViewportScroller).setOffset(() => [
      0,
      parseFloat(getComputedStyle(root).scrollPaddingBlockStart) || 0,
    ]);

    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  /** "/" moves to the search field, as on many sites. On a small screen it opens the drawer first. */
  protected focusSearch(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    if (event.key !== '/' || typing || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    // The drawer is hidden on a small screen; elsewhere the navigation is always visible.
    if (getComputedStyle(this.navElement().nativeElement).visibility === 'hidden') {
      this.menuOpen.set(true);
    }
    afterNextRender(() => this.nav().focusSearch(), { injector: this.injector });
  }
}
