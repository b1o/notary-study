import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import type { DocumentForm } from '../../core/content/content.models';
import { documentLayout, parseLine, type Line } from '../../core/reference/document-layout';

/**
 * A template set like the paper document: the boxes of its form, the centred title, the text,
 * the signatures with the seal of the notary, and the certification of the notary as a stamp.
 * The text stays Bulgarian in both languages, as the document is.
 */
@Component({
  selector: 'nc-document-sheet',
  imports: [NgTemplateOutlet],
  templateUrl: './document-sheet.html',
  styleUrl: './document-sheet.scss',
  host: { lang: 'bg' },
})
export class DocumentSheet {
  readonly text = input.required<string>();
  /** The printed form, for a notarial deed: the fee box, the entry box and the frame. */
  readonly form = input<DocumentForm>();

  protected readonly layout = computed(() => documentLayout(this.text()));
  protected readonly boxes = computed(() =>
    (this.form()?.boxes ?? []).map((box) => ({
      title: box.title,
      lines: box.lines.map(parseLine),
    })),
  );

  /** A blank without a hint, "[...]": it is set as an empty line to write on. */
  protected isEmpty(parts: Line): boolean {
    return parts.every((part) => part.kind === 'text' && /^[.…\s]*$/.test(part.text));
  }

  /** One item for each signature line of a signer. */
  protected slots(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index);
  }
}
