import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

/** A horizontal swipe with a finger, and where it started (in CSS pixels from the left). */
export interface SwipeEvent {
  readonly direction: 'left' | 'right';
  readonly startX: number;
  /** The element where the finger first touched. */
  readonly target: Element;
}

/** The shortest horizontal move that counts as a swipe. */
const MIN_DISTANCE = 60;
/** A swipe is mostly horizontal: at least twice as far sideways as up or down. */
const MIN_RATIO = 2;
/** A slower move is a drag or a scroll, not a swipe. */
const MAX_DURATION = 800;

/**
 * Emits `swipe` for a horizontal swipe with a finger on the host. Vertical scrolling stays
 * with the browser: the listeners are passive and only compare the start and the end of a touch.
 * A touch that starts in an element that scrolls sideways (a wide table, a row of letters) or
 * in a text field is not a swipe.
 */
@Directive({ selector: '[ncSwipe]' })
export class Swipe {
  readonly swipe = output<SwipeEvent>();

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    let start: { x: number; y: number; time: number; target: Element } | undefined;

    const onStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      const target = event.target instanceof Element ? event.target : undefined;
      start =
        event.touches.length === 1 && target && !scrollsSideways(target, host)
          ? { x: touch.clientX, y: touch.clientY, time: event.timeStamp, target }
          : undefined;
    };
    const onEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!start || !touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      const quick = event.timeStamp - start.time <= MAX_DURATION;
      if (quick && Math.abs(dx) >= MIN_DISTANCE && Math.abs(dx) >= MIN_RATIO * Math.abs(dy)) {
        this.swipe.emit({
          direction: dx > 0 ? 'right' : 'left',
          startX: start.x,
          target: start.target,
        });
      }
      start = undefined;
    };
    const onCancel = () => (start = undefined);

    host.addEventListener('touchstart', onStart, { passive: true });
    host.addEventListener('touchend', onEnd, { passive: true });
    host.addEventListener('touchcancel', onCancel, { passive: true });
    inject(DestroyRef).onDestroy(() => {
      host.removeEventListener('touchstart', onStart);
      host.removeEventListener('touchend', onEnd);
      host.removeEventListener('touchcancel', onCancel);
    });
  }
}

/** True when the element or a parent up to the host scrolls sideways, or takes text input. */
function scrollsSideways(element: Element, host: Element): boolean {
  for (let node: Element | null = element; node && node !== host; node = node.parentElement) {
    if (node.matches('input, textarea, select, [contenteditable="true"]')) return true;
    const overflow = getComputedStyle(node).overflowX;
    if ((overflow === 'auto' || overflow === 'scroll') && node.scrollWidth > node.clientWidth) {
      return true;
    }
  }
  return false;
}
