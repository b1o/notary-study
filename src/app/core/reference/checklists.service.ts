import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';

import type { Checklist } from '../content/content.models';
import { isRecord, storedSignal } from '../storage/stored-signal';

/** Ticks of each checklist: checklist id → item key ("section.item") → ticked. */
type Ticks = Readonly<Record<string, Readonly<Record<string, boolean>>>>;

/**
 * The document checklists, and the items that the reader ticked. The ticks stay in this browser,
 * so a checklist can follow a file over several days.
 */
@Service()
export class ChecklistsService {
  readonly resource = httpResource<readonly Checklist[]>(() => 'data/checklists.json');

  private readonly ticks = storedSignal<Ticks>('nc.checklists', {}, (stored, fallback) =>
    isRecord(stored) ? (stored as Ticks) : fallback,
  );

  checklist(id: string): Checklist | undefined {
    return this.resource.hasValue()
      ? this.resource.value().find((checklist) => checklist.id === id)
      : undefined;
  }

  isTicked(checklistId: string, itemKey: string): boolean {
    return !!this.ticks()[checklistId]?.[itemKey];
  }

  setTicked(checklistId: string, itemKey: string, ticked: boolean): void {
    this.ticks.update((all) => ({
      ...all,
      [checklistId]: { ...all[checklistId], [itemKey]: ticked },
    }));
  }

  clear(checklistId: string): void {
    this.ticks.update((all) =>
      Object.fromEntries(Object.entries(all).filter(([id]) => id !== checklistId)),
    );
  }
}
