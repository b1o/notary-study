import { DestroyRef, inject, signal, type Signal } from '@angular/core';

/**
 * The width of an element on screen, in CSS pixels, kept up to date with a ResizeObserver.
 * Call it in an injection context; the observer stops when that context is destroyed.
 */
export function elementWidth(element: Element): Signal<number> {
  const width = signal(Math.round(element.getBoundingClientRect().width));
  const observer = new ResizeObserver(([entry]) =>
    width.set(Math.round(entry.borderBoxSize[0].inlineSize)),
  );
  observer.observe(element);
  inject(DestroyRef).onDestroy(() => observer.disconnect());
  return width.asReadonly();
}

/** The size of 1rem in CSS pixels. It changes only with the browser's font size setting. */
export function remInPixels(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}
