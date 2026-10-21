import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';

import type { Checklist } from '../content/content.models';

/**
 * The checklists: examples of what an office asks for and checks in a common transaction. They are
 * study material, not a record of a real file, so nothing about them is saved (docs/design.md).
 */
@Service()
export class ChecklistsService {
  readonly resource = httpResource<readonly Checklist[]>(() => 'data/checklists.json');

  checklist(id: string): Checklist | undefined {
    return this.resource.hasValue()
      ? this.resource.value().find((checklist) => checklist.id === id)
      : undefined;
  }
}
