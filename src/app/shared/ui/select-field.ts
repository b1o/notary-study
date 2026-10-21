import { Component, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import type { Choice } from './choice-group';
import { Icon } from './icon';

/**
 * A drop-down list with its label above it, for a choice with too many or too long options for a
 * ChoiceGroup. Use it with `[(value)]` or with a Signal Forms field: `[formField]="form.kind"`.
 * The browser's own arrow is off (see select.text-field); the arrow here is an icon, so it has the
 * same inset as the text and the same colour as the other icons.
 */
@Component({
  selector: 'nc-select-field',
  imports: [Icon],
  template: `
    <label class="field">
      <span class="field__label">{{ label() }}</span>
      <span class="select-field__control">
        <select class="text-field" (change)="select($event)">
          @for (choice of choices(); track choice.value) {
            <!-- [selected] and not [value] on the select: the options do not exist yet when the select gets its value. -->
            <option [value]="choice.value" [selected]="choice.value === value()">
              {{ choice.label }}
            </option>
          }
        </select>
        <nc-icon class="select-field__arrow" name="chevronDown" />
      </span>
    </label>
  `,
  styles: `
    :host {
      display: block;
    }
    .select-field__control {
      position: relative;
      display: grid;
    }
    select {
      inline-size: 100%;
    }
    /* The icon lies over the select; clicks go through it to the select. */
    .select-field__arrow {
      position: absolute;
      inset-block: 0;
      inset-inline-end: var(--space-3);
      margin-block: auto;
      color: var(--color-ink-2);
      pointer-events: none;
      --icon-size: 1.125rem;
    }
  `,
})
export class SelectField<T extends string> implements FormValueControl<T> {
  readonly value = model.required<T>();
  readonly choices = input.required<readonly Choice<T>[]>();
  readonly label = input.required<string>();

  protected select(event: Event): void {
    this.value.set((event.target as HTMLSelectElement).value as T);
  }
}
