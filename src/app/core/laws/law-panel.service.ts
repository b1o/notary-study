import { computed, Service, signal } from '@angular/core';

import { storedSignal } from '../storage/stored-signal';
import { articleKey, type LawReference } from './citation';

export const LAW_PANEL_WIDTH = { min: 340, max: 900, initial: 480 } as const;

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

  /** Panel width in CSS pixels, kept between visits. */
  readonly width = storedSignal<number>(
    'nc.lawPanel.width',
    LAW_PANEL_WIDTH.initial,
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
    this.width.set(clampWidth(width));
  }
}

export function clampWidth(width: number): number {
  return Math.round(Math.min(LAW_PANEL_WIDTH.max, Math.max(LAW_PANEL_WIDTH.min, width)));
}
