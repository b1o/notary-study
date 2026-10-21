import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, ElementRef, inject, input } from '@angular/core';

import { elementWidth, remInPixels } from '../dom/element-size';

/**
 * Width of the main column:
 *   full     the whole frame, for overviews and lists
 *   reading  one column of text (the reading measure)
 */
export type PageMain = 'full' | 'reading';

/** Where the side column goes on a wide page. On a narrow page it folds above the main column. */
export type PageAside = 'none' | 'start' | 'end';

/** Page width (including its padding) from which the side column fits next to the main column. */
const ASIDE_BESIDE_FROM_REM = 62;

/**
 * The frame of every page: the same width, the same left edge and the same padding everywhere.
 *
 *   <nc-page-layout main="reading" aside="end" [asideLabel]="...">
 *     <header pageHeader>...title...</header>
 *     <nav pageAside>...contents...</nav>
 *     ...main content...
 *   </nc-page-layout>
 */
@Component({
  selector: 'nc-page-layout',
  imports: [NgTemplateOutlet],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.scss',
  host: {
    '[class]': "'page-layout--main-' + main()",
    '[class.page-layout--aside-start]': "aside() === 'start'",
    '[class.page-layout--beside]': 'asideBeside()',
  },
})
export class PageLayout {
  readonly main = input<PageMain>('full');
  readonly aside = input<PageAside>('none');
  /** Title of the side column, and the summary of the folded side column on a narrow page. */
  readonly asideLabel = input('');

  private readonly width = elementWidth(inject(ElementRef).nativeElement);
  private readonly besideFrom = ASIDE_BESIDE_FROM_REM * remInPixels();

  /** True when the side column stands next to the main column. */
  protected readonly asideBeside = computed(
    () => this.aside() !== 'none' && this.width() >= this.besideFrom,
  );
}
