import {
  PLACE_SURCHARGES,
  TAX_KINDS,
  type FeeAction,
  type PlaceSurcharge,
  type TaxKind,
} from './fee-actions';
import {
  entryFee,
  item10Fee,
  item12Fee,
  item5Fee,
  item6Fee,
  item8Fee,
  item9Fee,
  roundCents,
  toEuro,
  toLeva,
} from './tariff';

/** VAT on the notarial fee, for a notary registered for VAT. */
const VAT_RATE = 0.2;

/** A number that the reader enters. It is null while its field is empty. */
export type Entered = number | null;

/**
 * What the reader enters. Amounts are in euro. An empty field or a negative amount counts as
 * zero; a count of signatures, pages or copies is at least 1 (see tariff.ts).
 */
export interface FeeInputs {
  /** The agreed price, the secured amount, the insured value or the market value, by action. */
  readonly price: Entered;
  readonly assessment: Entered;
  /** The agreed price of a vehicle (the price field holds its insured value). */
  readonly agreed: Entered;
  /** The market value of the land of a building right (the price field holds the price of the right). */
  readonly land: Entered;
  readonly signatures: Entered;
  readonly pages: Entered;
  readonly copies: Entered;
  readonly forProperty: boolean;
  readonly redelegation: boolean;
  readonly surcharge: PlaceSurcharge;
  readonly vat: boolean;
  readonly entry: boolean;
  readonly taxKind: TaxKind;
  /** The municipality's rate in percent. The bill keeps it inside the limits of the law. */
  readonly taxRate: Entered;
}

export type BillLineKind = 'fee' | 'surcharge' | 'vat' | 'entry' | 'tax';

export interface BillLine {
  readonly kind: BillLineKind;
  readonly euro: number;
  /** The amount in leva as the tariff states it, where the tariff gives one. */
  readonly leva?: number;
  /** The provision behind the line, as a reference: "tarifa:8". */
  readonly ref?: string;
  /** The tax rate in percent that the line uses. */
  readonly rate?: number;
}

export interface Bill {
  /** The material interest, when the action has one. */
  readonly interest?: { readonly euro: number; readonly leva: number };
  readonly lines: readonly BillLine[];
  readonly total: number;
}

/** An entered number as an amount: an empty field or a negative number counts as zero. */
const amount = (value: Entered) => Math.max(0, value ?? 0);

/** The material interest of an action in euro, or undefined for item 5 and 6 actions. */
function materialInterest(action: FeeAction, inputs: FeeInputs): number | undefined {
  const price = amount(inputs.price);
  switch (action.interest) {
    case 'property':
    case 'ownership':
      return Math.max(price, amount(inputs.assessment));
    case 'building':
      return Math.max(0.9 * amount(inputs.land), price, amount(inputs.assessment));
    case 'vehicle':
      return Math.max(price, amount(inputs.agreed));
    case 'claim':
    case 'price':
      return price;
    default:
      return undefined;
  }
}

/** The bill of an action: the notarial fee and its additions, the entry fee and the local tax. */
export function computeBill(action: FeeAction, inputs: FeeInputs): Bill {
  const interestEuro = materialInterest(action, inputs);
  const interestLeva = toLeva(interestEuro ?? 0);
  const lines: BillLine[] = [];

  const feeLeva = notarialFee(action, inputs, interestLeva);
  lines.push({ kind: 'fee', euro: toEuro(feeLeva), leva: feeLeva, ref: `tarifa:${action.item}` });

  const surcharge = PLACE_SURCHARGES.find((option) => option.id === inputs.surcharge)?.rate ?? 0;
  if (surcharge) {
    const leva = feeLeva * surcharge;
    lines.push({ kind: 'surcharge', euro: toEuro(leva), leva, ref: 'tarifa:23' });
  }

  if (inputs.vat) {
    const notaryEuro = lines.reduce((sum, line) => sum + line.euro, 0);
    lines.push({ kind: 'vat', euro: roundCents(notaryEuro * VAT_RATE) });
  }

  if (action.entry && inputs.entry) {
    const leva = entryFee(interestLeva);
    lines.push({ kind: 'entry', euro: toEuro(leva), leva, ref: 'tdtav:2:1' });
  }

  const tax = TAX_KINDS.find((kind) => kind.id === inputs.taxKind);
  if (action.localTax && tax && tax.id !== 'none') {
    const rate = Math.min(tax.max, Math.max(tax.min, amount(inputs.taxRate)));
    const base = taxBase(action, inputs, tax.gratuitous, interestEuro ?? 0);
    lines.push({ kind: 'tax', euro: roundCents((base * rate) / 100), ref: tax.ref, rate });
  }

  return {
    interest: interestEuro === undefined ? undefined : { euro: interestEuro, leva: interestLeva },
    lines,
    total: roundCents(lines.reduce((sum, line) => sum + line.euro, 0)),
  };
}

/** The notarial fee in leva, by the item of the tariff that the action follows. */
function notarialFee(action: FeeAction, inputs: FeeInputs, interestLeva: number): number {
  switch (action.item) {
    case '8':
    case '11':
      return item8Fee(interestLeva);
    case '9':
      return item9Fee(interestLeva);
    case '10':
      return item10Fee(interestLeva);
    case '12':
      return item12Fee(interestLeva);
    case '5':
      return item5Fee(amount(inputs.signatures), inputs.forProperty, inputs.redelegation);
    case '6':
      return item6Fee(amount(inputs.pages), amount(inputs.copies));
  }
}

/**
 * The base of the local tax in euro (Art. 46(2) ЗМДТ). For real estate and rights over it: the
 * agreed price, or the tax assessment if it is higher; a gratuitous acquisition has no agreed price,
 * so only the tax assessment. The price field of a building right holds the price of the right, not
 * the land. For a vehicle: its insured value (Art. 46(2)(2) and 33(1)(4) ЗМДТ).
 */
function taxBase(
  action: FeeAction,
  inputs: FeeInputs,
  gratuitous: boolean,
  interestEuro: number,
): number {
  switch (action.interest) {
    case 'property':
    case 'building':
    case 'ownership': {
      const assessment = amount(inputs.assessment);
      return gratuitous ? assessment : Math.max(amount(inputs.price), assessment);
    }
    case 'vehicle':
      return amount(inputs.price);
    default:
      return interestEuro;
  }
}
