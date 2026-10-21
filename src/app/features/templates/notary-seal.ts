import { Component, computed, input } from '@angular/core';

import type { NotarySeal } from '../../core/content/content.models';

let nextSeal = 0;

/**
 * The seal of the notary as Ordinance No. 32 Art. 14(1) sets it: a circle of 40 mm, with "Нотариус"
 * and the register number in the upper half of the ring, "Република България" in the lower half,
 * and the name, the district and the court in the centre. The drawing is 400 units for 40 mm.
 */
@Component({
  selector: 'nc-notary-seal',
  template: `
    @let text = seal();
    <svg viewBox="0 0 400 400" role="img" [attr.aria-label]="label()">
      <defs>
        <path [attr.id]="id + '-upper'" d="M 42 200 A 158 158 0 0 1 358 200" />
        <path [attr.id]="id + '-lower'" d="M 13 200 A 187 187 0 0 0 387 200" />
      </defs>
      <!-- A little turned, as a hand stamps it; the turn stays inside the circle. -->
      <g transform="rotate(-8 200 200)">
        <circle cx="200" cy="200" r="196" class="seal__ring" />
        <circle cx="200" cy="200" r="148" class="seal__ring seal__ring--inner" />
        <text class="seal__arc">
          <textPath [attr.href]="'#' + id + '-upper'" startOffset="50%">{{ text.upper }}</textPath>
        </text>
        <text class="seal__arc">
          <textPath [attr.href]="'#' + id + '-lower'" startOffset="50%">{{ text.lower }}</textPath>
        </text>
        @for (line of text.centre; track $index) {
          <text class="seal__centre" x="200" [attr.y]="centreY($index)">{{ line }}</text>
        }
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: block;
      inline-size: var(--seal-size);
      block-size: var(--seal-size);
      color: var(--color-accent-text);
    }

    svg {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      overflow: visible;
    }

    .seal__ring {
      fill: none;
      stroke: currentColor;
      stroke-width: 5;
    }

    .seal__ring--inner {
      stroke-width: 2.5;
    }

    text {
      fill: currentColor;
      font-family: var(--font-document);
      text-anchor: middle;
    }

    .seal__arc {
      font-size: 27px;
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .seal__centre {
      font-size: 25px;
    }
  `,
})
export class NotarySealMark {
  readonly seal = input.required<NotarySeal>();

  /** The ids of the paths for the ring text, apart for each seal on the page. */
  protected readonly id = `seal-${nextSeal++}`;

  protected readonly label = computed(() => {
    const { name, upper, centre, lower } = this.seal();
    return `${name}: ${[upper, ...centre, lower].join(', ')}`;
  });

  /** The centre lines, around the middle of the circle. */
  protected centreY(index: number): number {
    const count = this.seal().centre.length;
    return 200 + (index - (count - 1) / 2) * 36 + 9;
  }
}
