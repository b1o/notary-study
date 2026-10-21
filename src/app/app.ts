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
import { Swipe, type SwipeEvent } from './shared/dom/swipe';
import { Icon } from './shared/ui/icon';

/** A swipe to the right that starts this close to the left edge opens the navigation drawer. */
const DRAWER_SWIPE_ZONE = 64;

/**
 * The app frame: navigation on the left, the page in the middle, the law panel on the right.
 * On a small screen, swipes open and close the navigation drawer and close the law panel.
 */
@Component({
  selector: 'nc-root',
  imports: [RouterOutlet, RouterLink, SideNav, LawPanel, Icon],
  hostDirectives: [Swipe],
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
  private readonly panelElement = viewChild(LawPanel, { read: ElementRef });
  private readonly injector = inject(Injector);

  constructor() {
    // Created here, so that the saved reading settings apply to <html> before the first page shows.
    inject(ReadingSettingsService);

    inject(Swipe).swipe.subscribe((swipe) => this.onSwipe(swipe));

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

  /**
   * Swipes on a small screen, where the navigation is a drawer and the law panel lies over the
   * page (see app.scss): to the right from the left edge opens the drawer, to the left closes it,
   * and to the right on the law panel closes the panel.
   */
  private onSwipe({ direction, startX, target }: SwipeEvent): void {
    const panel = this.panelElement()?.nativeElement;
    if (panel?.contains(target)) {
      if (direction === 'right' && getComputedStyle(panel).position === 'fixed') this.panel.close();
      return;
    }
    if (direction === 'left') {
      this.menuOpen.set(false);
    } else if (startX <= DRAWER_SWIPE_ZONE && this.navIsDrawer()) {
      this.menuOpen.set(true);
    }
  }

  /** The drawer is hidden on a small screen; elsewhere the navigation is always visible. */
  private navIsDrawer(): boolean {
    return getComputedStyle(this.navElement().nativeElement).position === 'fixed';
  }

  /** "/" moves to the search field, as on many sites. On a small screen it opens the drawer first. */
  protected focusSearch(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    if (event.key !== '/' || typing || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    if (this.navIsDrawer()) {
      this.menuOpen.set(true);
    }
    afterNextRender(() => this.nav().focusSearch(), { injector: this.injector });
  }
}
