import { DestroyRef, inject, signal, type Signal } from '@angular/core';

/**
 * The width of an element on screen, in CSS pixels, kept up to date with a ResizeObserver.
 * Call it in an injection context; the observer stops when that context is destroyed.
 */
export function elementWidth(element: Element): Signal<number> {
  return observedSize(element, (size) => size.inlineSize);
}

/** The height of an element on screen, in CSS pixels, like elementWidth. */
export function elementHeight(element: Element): Signal<number> {
  return observedSize(element, (size) => size.blockSize);
}

function observedSize(
  element: Element,
  pick: (size: { inlineSize: number; blockSize: number }) => number,
): Signal<number> {
  const rect = element.getBoundingClientRect();
  const value = signal(Math.round(pick({ inlineSize: rect.width, blockSize: rect.height })));
  const observer = new ResizeObserver(([entry]) =>
    value.set(Math.round(pick(entry.borderBoxSize[0]))),
  );
  observer.observe(element);
  inject(DestroyRef).onDestroy(() => observer.disconnect());
  return value.asReadonly();
}

/** The size of 1rem in CSS pixels. It changes only with the browser's font size setting. */
export function remInPixels(): number {
  return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
}
