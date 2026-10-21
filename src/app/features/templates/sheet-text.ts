import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';

import type { SheetLine } from '../../core/reference/sheet-line';

/**
 * One line of a template on the sheet: its text, its blanks with their dotted lines, and its boxes
 * to tick. Each visible piece carries its position (data-at), so that the sheet can find where a
 * line on the page starts. A blank keeps its brackets for screen readers and for a copy.
 * Angular drops the white space between the elements, so the parts join without spaces.
 */
@Component({
  selector: 'nc-sheet-text',
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #parts let-list>
      @for (part of list; track $index) {
        @switch (part.kind) {
          @case ('text') {
            <span class="sheet__text" [attr.data-at]="part.at">{{ part.text }}</span>
          }
          @case ('tick') {
            <span class="tick" [attr.data-at]="part.at"
              ><span class="visually-hidden">[ ]</span></span
            >
          }
          @case ('fill') {
            @for (piece of part.pieces; track $index) {
              <span
                class="fill"
                [attr.data-at]="part.at + $index"
                [style.inline-size.ch]="piece"
              ></span>
            }
          }
          @case ('blank') {
            <span class="blank">
              @if (part.opens) {
                <span class="visually-hidden">[</span>
              }
              @if (part.empty && part.opens) {
                <span class="visually-hidden">...</span>
              }
              <ng-container
                [ngTemplateOutlet]="parts"
                [ngTemplateOutletContext]="{ $implicit: part.parts }"
              />
              @if (part.closes) {
                <span class="visually-hidden">]</span>
              }
            </span>
          }
        }
      }
    </ng-template>
    <ng-container
      [ngTemplateOutlet]="parts"
      [ngTemplateOutletContext]="{ $implicit: line().parts }"
    />
  `,
  styleUrl: './sheet-text.scss',
})
export class SheetText {
  readonly line = input.required<SheetLine>();
}
