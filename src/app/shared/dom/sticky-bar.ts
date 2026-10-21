import { DestroyRef, Directive, DOCUMENT, effect, ElementRef, inject } from '@angular/core';

import { elementHeight } from './element-size';

/**
 * A bar that sticks to the top of the page while it scrolls (style it with .sticky-bar).
 * Its height goes into --sticky-bar-height on <html>, so that a jump to a fragment stops under
 * the bar (see scroll-padding in _base.scss).
 */
@Directive({ selector: '[ncStickyBar]', host: { class: 'sticky-bar' } })
export class StickyBar {
  constructor() {
    const height = elementHeight(inject(ElementRef).nativeElement);
    const root = inject(DOCUMENT).documentElement;
    effect(() => root.style.setProperty('--sticky-bar-height', `${height()}px`));
    inject(DestroyRef).onDestroy(() => root.style.removeProperty('--sticky-bar-height'));
  }
}
