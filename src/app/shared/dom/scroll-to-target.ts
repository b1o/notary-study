import { afterRenderEffect, ElementRef, inject } from '@angular/core';

/**
 * Scroll to the element with the id that `target` returns, after it renders.
 * Use it for content that arrives after the navigation, where the router's own anchor
 * scrolling finds nothing. Return undefined from `target` while the content loads.
 * Each target scrolls once, so later renders do not move the page under the reader.
 */
export function scrollToTarget(target: () => string | undefined): void {
  const host: HTMLElement = inject(ElementRef).nativeElement;
  let done: string | undefined;
  afterRenderEffect(() => {
    const id = target();
    if (!id) {
      done = undefined;
      return;
    }
    if (id === done) {
      return;
    }
    const element = host.querySelector(`#${CSS.escape(id)}`);
    if (element) {
      element.scrollIntoView({ block: 'start' });
      done = id;
    }
  });
}
