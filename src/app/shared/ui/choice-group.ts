import { Component, input, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

export interface Choice<T extends string> {
  readonly value: T;
  readonly label: string;
}

/** Options with their labels, in the order of `values`. */
export function toChoices<T extends string>(
  values: readonly T[],
  labels: Readonly<Record<T, string>>,
): Choice<T>[] {
  return values.map((value) => ({ value, label: labels[value] }));
}

let nextGroup = 0;

/**
 * A row of mutually exclusive options (a radio group that looks like a segmented button).
 * Use it with `[(value)]` or with a Signal Forms field: `[formField]="form.theme"`.
 */
@Component({
  selector: 'nc-choice-group',
  template: `
    <fieldset class="choice-group">
      <legend class="choice-group__legend" [class.visually-hidden]="hideLegend()">
        {{ legend() }}
      </legend>
      <div class="choice-group__options">
        @for (choice of choices(); track choice.value) {
          <label class="choice-group__option">
            <input
              type="radio"
              [name]="groupName"
              [value]="choice.value"
              [checked]="choice.value === value()"
              (change)="value.set(choice.value)"
            />
            <span>{{ choice.label }}</span>
          </label>
        }
      </div>
    </fieldset>
  `,
  styleUrl: './choice-group.scss',
})
export class ChoiceGroup<T extends string> implements FormValueControl<T> {
  readonly value = model.required<T>();
  readonly choices = input.required<readonly Choice<T>[]>();
  readonly legend = input.required<string>();
  /** Keep the legend for screen readers only, when a visible label is next to the group. */
  readonly hideLegend = input(false);

  /** Radio buttons of one group share a name, so the arrow keys move between them. */
  protected readonly groupName = `nc-choice-${nextGroup++}`;
}
