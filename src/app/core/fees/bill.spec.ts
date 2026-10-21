import { computeBill, type Bill, type BillLineKind, type FeeInputs } from './bill';
import { FEE_ACTIONS } from './fee-actions';
import { item8Fee, toEuro, toLeva } from './tariff';

const action = (id: string) => FEE_ACTIONS.find((candidate) => candidate.id === id)!;

/** The line of a kind, for example the VAT line, of a bill. */
const lineOf = (bill: Bill, kind: BillLineKind) => bill.lines.find((line) => line.kind === kind);

const INPUTS: FeeInputs = {
  price: 150_000,
  assessment: 60_000,
  agreed: 0,
  land: 0,
  signatures: 1,
  pages: 1,
  copies: 1,
  forProperty: false,
  redelegation: false,
  surcharge: 'office',
  vat: true,
  entry: true,
  taxKind: 'sale',
  taxRate: 3,
};

describe('computeBill', () => {
  const bill = computeBill(action('deed'), INPUTS);
  const line = (kind: BillLineKind) => lineOf(bill, kind);

  it('uses the higher of price and tax assessment as the material interest', () => {
    expect(bill.interest?.euro).toBe(150_000);
  });

  it('applies item 8 to the interest in leva and converts the fee to euro', () => {
    expect(line('fee')).toMatchObject({
      euro: toEuro(item8Fee(toLeva(150_000))),
      ref: 'tarifa:8',
    });
  });

  it('adds VAT on the notarial fee, the entry fee and the local tax', () => {
    const fee = line('fee')!.euro;
    expect(line('vat')?.euro).toBeCloseTo(fee * 0.2, 2);
    expect(line('entry')).toMatchObject({
      euro: toEuro(0.001 * toLeva(150_000)),
      ref: 'tdtav:2:1',
    });
    expect(line('tax')).toMatchObject({ euro: 4_500, rate: 3, ref: 'zmdt:47:2' });
  });

  it('adds up the lines', () => {
    const sum = bill.lines.reduce((total, current) => total + current.euro, 0);
    expect(bill.total).toBeCloseTo(sum, 2);
  });

  it('keeps the tax rate inside the limits of the law', () => {
    const gift = computeBill(action('deed'), { ...INPUTS, taxKind: 'giftSiblings', taxRate: 5 });
    expect(lineOf(gift, 'tax')?.rate).toBe(0.8);
  });

  it('adds item 23 for work outside the office', () => {
    const outside = computeBill(action('deed'), { ...INPUTS, surcharge: 'plus50', vat: false });
    const surcharge = lineOf(outside, 'surcharge');
    expect(surcharge?.ref).toBe('tarifa:23');
    expect(surcharge?.leva).toBeCloseTo(lineOf(outside, 'fee')!.leva! * 0.5, 6);
  });

  it('counts an empty field or a negative amount as zero', () => {
    const empty = computeBill(action('deed'), { ...INPUTS, price: null, assessment: -5 });
    expect(empty.interest?.euro).toBe(0);
    expect(lineOf(empty, 'tax')?.euro).toBe(0);
  });

  it('keeps an empty tax rate at the lower limit of the law', () => {
    const empty = computeBill(action('deed'), { ...INPUTS, taxRate: null });
    expect(lineOf(empty, 'tax')?.rate).toBe(0.1);
  });

  it('taxes a gift of real estate on the tax assessment, not on the market value', () => {
    // A gift has no agreed price, so Art. 46(2)(1) ЗМДТ leaves the tax assessment.
    const gift = computeBill(action('deed'), { ...INPUTS, taxKind: 'giftSiblings', taxRate: 0.6 });
    expect(lineOf(gift, 'tax')?.euro).toBe(360);
    expect(gift.interest?.euro).toBe(150_000);
  });

  it('taxes ownership by prescription on the tax assessment, at the rate of a gift', () => {
    const prescription = computeBill(action('circumstantial'), {
      ...INPUTS,
      price: 100_000,
      assessment: 40_000,
      taxKind: 'prescription',
      taxRate: 5,
    });
    expect(prescription.interest?.euro).toBe(100_000);
    expect(lineOf(prescription, 'tax')).toMatchObject({ euro: 2_000, rate: 5 });
  });

  it('keeps the rate of prescription inside the limits of a gift between other persons', () => {
    const low = computeBill(action('circumstantial'), {
      ...INPUTS,
      taxKind: 'prescription',
      taxRate: 3,
    });
    expect(lineOf(low, 'tax')?.rate).toBe(3.3);
  });

  it('takes the interest of a building right from the land, unless the right is worth more', () => {
    const building = { ...INPUTS, land: 150_000, price: 100_000, assessment: 30_000 };
    expect(computeBill(action('building'), building).interest?.euro).toBe(135_000);
    const dearer = computeBill(action('building'), { ...building, price: 140_000 });
    expect(dearer.interest?.euro).toBe(140_000);
  });

  it('taxes a building right on its price or its tax assessment, not on the land', () => {
    const building = computeBill(action('building'), {
      ...INPUTS,
      land: 150_000,
      price: 100_000,
      assessment: 30_000,
    });
    expect(lineOf(building, 'tax')?.euro).toBe(3_000);
  });

  it('has no material interest, entry fee or tax for signatures without interest', () => {
    const signatures = computeBill(action('signatures'), { ...INPUTS, signatures: 2, vat: false });
    expect(signatures.interest).toBeUndefined();
    expect(signatures.lines).toEqual([{ kind: 'fee', euro: toEuro(7), leva: 7, ref: 'tarifa:5' }]);
  });
});
