import { Component, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import type { Choice } from './choice-group';

/**
 * A drop-down list with its label above it, for a choice with too many or too long options for a
 * ChoiceGroup. Use it with `[(value)]` or with a Signal Forms field: `[formField]="form.kind"`.
 */
@Component({
  selector: 'nc-select-field',
  template: `
    <label class="field">
      <span class="field__label">{{ label() }}</span>
      <select class="text-field" (change)="select($event)">
        @for (choice of choices(); track choice.value) {
          <!-- [selected] and not [value] on the select: the options do not exist yet when the select gets its value. -->
          <option [value]="choice.value" [selected]="choice.value === value()">
            {{ choice.label }}
          </option>
        }
      </select>
    </label>
  `,
  styles: `
    :host {
      display: block;
    }
    select {
      inline-size: 100%;
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
