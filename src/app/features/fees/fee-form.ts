import type { FeeInputs } from '../../core/fees/bill';
import type { FeeAction, InterestKind, TaxKind } from '../../core/fees/fee-actions';
import type { UiText } from '../../core/i18n/ui-text';

type FeesText = UiText['fees'];

/** A key of the fee texts that holds a plain label. */
type FeesLabel = { [K in keyof FeesText]: FeesText[K] extends string ? K : never }[keyof FeesText];

/** The number fields of the form. */
export type AmountKey = 'price' | 'assessment' | 'agreed' | 'signatures' | 'pages' | 'copies';
type FlagKey = 'forProperty' | 'redelegation';

const MONEY = { min: 0, step: 0.01 };
const COUNT = { min: 1, step: 1 };

/** The values that a number field accepts: an amount in euro from 0, or a count from 1. */
export const AMOUNT_LIMITS: Readonly<Record<AmountKey, { min: number; step: number }>> = {
  price: MONEY,
  assessment: MONEY,
  agreed: MONEY,
  signatures: COUNT,
  pages: COUNT,
  copies: COUNT,
};

interface AmountField {
  readonly key: AmountKey;
  readonly label: FeesLabel;
  /** The value of a new action, so that the bill shows a typical case at once. */
  readonly start: number;
}

/** The fields that an action asks for. */
export interface InterestForm {
  readonly amounts: readonly AmountField[];
  readonly flags: readonly { readonly key: FlagKey; readonly label: FeesLabel }[];
  /** A note under the fields. */
  readonly hint?: FeesLabel;
}

const field = (key: AmountKey, label: FeesLabel, start = AMOUNT_LIMITS[key].min): AmountField => ({
  key,
  label,
  start,
});

/** The form of each kind of material interest (see InterestKind). */
export const INTEREST_FORMS: Readonly<Record<InterestKind, InterestForm>> = {
  property: {
    amounts: [field('price', 'price', 150_000), field('assessment', 'assessment', 60_000)],
    flags: [],
  },
  building: {
    amounts: [field('price', 'price', 150_000), field('assessment', 'assessment', 60_000)],
    flags: [],
    hint: 'buildingHint',
  },
  claim: { amounts: [field('price', 'securedAmount', 100_000)], flags: [] },
  vehicle: {
    amounts: [field('price', 'insuredValue', 8_000), field('agreed', 'agreedPrice', 8_000)],
    flags: [],
    hint: 'vehicleHint',
  },
  assessment: { amounts: [field('price', 'marketValue', 20_000)], flags: [] },
  price: { amounts: [field('price', 'materialInterestInput', 50_000)], flags: [] },
  signatures: {
    amounts: [field('signatures', 'signatures')],
    flags: [
      { key: 'forProperty', label: 'propertySignatures' },
      { key: 'redelegation', label: 'redelegation' },
    ],
  },
  copies: { amounts: [field('pages', 'pages'), field('copies', 'copies')], flags: [] },
};

/** The values of the form without the tax rate, which has its own field (it follows the tax kind). */
export type FeeFormValue = Omit<FeeInputs, 'taxRate'>;

/**
 * The form values of a new action. The fields of the action start again; the place, VAT, entry
 * and tax choices carry over from the previous action.
 */
export function startingValue(action: FeeAction, previous?: FeeFormValue): FeeFormValue {
  const starts: Partial<Record<AmountKey, number>> = Object.fromEntries(
    INTEREST_FORMS[action.interest].amounts.map((amount) => [amount.key, amount.start]),
  );
  return {
    price: 0,
    assessment: 0,
    agreed: 0,
    signatures: 1,
    pages: 1,
    copies: 1,
    forProperty: false,
    redelegation: false,
    surcharge: previous?.surcharge ?? 'office',
    vat: previous?.vat ?? true,
    entry: previous?.entry ?? true,
    taxKind: startingTaxKind(action, previous?.taxKind),
    ...starts,
  };
}

/** Acquisition by prescription is the tax kind of a circumstantial verification, and of no other action. */
function startingTaxKind(action: FeeAction, previous: TaxKind | undefined): TaxKind {
  if (action.id === 'circumstantial') return 'prescription';
  return previous && previous !== 'prescription' ? previous : 'sale';
}
