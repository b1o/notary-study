import { computed, Service, signal } from '@angular/core';

import { storedSignal } from '../storage/stored-signal';
import { articleKey, type LawReference } from './citation';

/** Limits of a width that the reader sets by dragging the edge of the panel, in CSS pixels. */
export const LAW_PANEL_WIDTH = { min: 340, max: 1200 } as const;

/**
 * State of the law panel next to the reading area: which provision it shows,
 * the history of provisions opened in it, and its width.
 */
@Service()
export class LawPanelService {
  private readonly history = signal<readonly LawReference[]>([]);
  private readonly position = signal(-1);

  readonly current = computed<LawReference | undefined>(() => this.history()[this.position()]);
  readonly isOpen = computed(() => this.current() !== undefined);
  readonly canGoBack = computed(() => this.position() > 0);
  readonly canGoForward = computed(() => this.position() < this.history().length - 1);

  /**
   * The width that the reader chose, kept between visits. Null until the reader resizes the
   * panel: then the CSS default applies, which follows the window width (see app.scss).
   */
  readonly customWidth = storedSignal<number | null>(
    'nc.lawPanel.customWidth',
    null,
    (stored, fallback) => (typeof stored === 'number' ? clampWidth(stored) : fallback),
  );

  /** Show a provision. Opening the provision that is already shown does nothing. */
  open(reference: LawReference): void {
    const current = this.current();
    if (
      current &&
      articleKey(current) === articleKey(reference) &&
      current.paragraph === reference.paragraph
    ) {
      return;
    }
    // Like a browser: opening from the middle of the history drops the "forward" entries.
    this.history.update((history) => [...history.slice(0, this.position() + 1), reference]);
    this.position.update((position) => position + 1);
  }

  back(): void {
    if (this.canGoBack()) this.position.update((position) => position - 1);
  }

  forward(): void {
    if (this.canGoForward()) this.position.update((position) => position + 1);
  }

  close(): void {
    this.history.set([]);
    this.position.set(-1);
  }

  resize(width: number): void {
    this.customWidth.set(clampWidth(width));
  }

  /** Go back to the default width, which follows the window width. */
  resetWidth(): void {
    this.customWidth.set(null);
  }
}

export function clampWidth(width: number): number {
  return Math.round(Math.min(LAW_PANEL_WIDTH.max, Math.max(LAW_PANEL_WIDTH.min, width)));
}
