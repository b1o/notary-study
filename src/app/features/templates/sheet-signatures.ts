import { Component, input } from '@angular/core';

import type { NotarySeal } from '../../core/content/content.models';
import type { SheetRow } from '../../core/reference/sheet-flow';
import { NotarySealMark } from './notary-seal';
import { SheetText } from './sheet-text';

/**
 * The signature rows of a template: the place and the date at the start of a row, and for each
 * signer the role, the signature lines, the line for the name written by hand and the seal.
 */
@Component({
  selector: 'nc-sheet-signatures',
  imports: [SheetText, NotarySealMark],
  template: `
    @for (row of rows(); track $index) {
      <div class="row" [class.row--placed]="row.place">
        @if (row.place; as place) {
          <p class="place"><nc-sheet-text [line]="place" /></p>
        }
        @for (signer of row.signers; track $index) {
          <div class="signer">
            @if (signer.role; as role) {
              <span class="role"><nc-sheet-text [line]="role" /></span>
            }
            <span class="lines" aria-hidden="true">
              @for (slot of slots(signer.lines); track slot) {
                <span class="line"></span>
              }
            </span>
            @if (signer.note; as note) {
              <span class="note"><nc-sheet-text [line]="note" /></span>
            }
            @if (signer.handwriting; as hand) {
              <span class="hand">
                <span class="hand__line" [style.inline-size.ch]="hand.size"></span>
                <span class="hand__caption">({{ hand.caption }})</span>
              </span>
            }
            @if (signer.seal && seal(); as sealText) {
              <nc-notary-seal class="seal" [seal]="sealText" />
            }
          </div>
        }
      </div>
    }
  `,
  styleUrl: './sheet-signatures.scss',
})
export class SheetSignatures {
  readonly rows = input.required<readonly SheetRow[]>();
  readonly seal = input<NotarySeal>();

  /** One item for each signature line of a signer. */
  protected slots(count: number): number[] {
    return Array.from({ length: count }, (_, index) => index);
  }
}
