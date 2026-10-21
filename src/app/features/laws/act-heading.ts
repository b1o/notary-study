import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';

import type { ActHeadingEntry } from './act-entries';

/**
 * A heading of an act: a muted label ("Глава първа"), the title, and amendment notes.
 * Outline level 1 is an h2 (the page title is the h1), down to level 4 as an h5.
 * Sizes are in em of the reading size, like the article text below the heading.
 */
@Component({
  selector: 'nc-act-heading',
  imports: [NgTemplateOutlet],
  templateUrl: './act-heading.html',
  styleUrl: './act-heading.scss',
  host: {
    lang: 'bg',
    '[id]': 'heading().id',
    '[class]': "'act-heading--level-' + heading().level",
    '[class.act-heading--caps]': 'heading().parts.caps',
  },
})
export class ActHeading {
  readonly heading = input.required<ActHeadingEntry>();
}
