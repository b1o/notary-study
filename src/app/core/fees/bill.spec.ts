import { computeBill, type FeeInputs } from './bill';
import { FEE_ACTIONS } from './fee-actions';
import { item8Fee, toEuro, toLeva } from './tariff';

const action = (id: string) => FEE_ACTIONS.find((candidate) => candidate.id === id)!;

const INPUTS: FeeInputs = {
  price: 150_000,
  assessment: 60_000,
  agreed: 0,
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
  const line = (kind: string) => bill.lines.find((candidate) => candidate.kind === kind);

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
    expect(line('entry')?.euro).toBe(toEuro(0.001 * toLeva(150_000)));
    expect(line('tax')).toMatchObject({ euro: 4_500, rate: 3, ref: 'zmdt:47:2' });
  });

  it('adds up the lines', () => {
    const sum = bill.lines.reduce((total, current) => total + current.euro, 0);
    expect(bill.total).toBeCloseTo(sum, 2);
  });

  it('keeps the tax rate inside the limits of the law', () => {
    const gift = computeBill(action('deed'), { ...INPUTS, taxKind: 'giftSiblings', taxRate: 5 });
    expect(gift.lines.find((current) => current.kind === 'tax')?.rate).toBe(0.8);
  });

  it('adds item 23 for work outside the office', () => {
    const outside = computeBill(action('deed'), { ...INPUTS, surcharge: 'plus50', vat: false });
    const fee = outside.lines[0];
    expect(outside.lines[1]).toMatchObject({ kind: 'surcharge', ref: 'tarifa:23' });
    expect(outside.lines[1].leva).toBeCloseTo(fee.leva! * 0.5, 6);
  });

  it('counts an empty field or a negative amount as zero', () => {
    const empty = computeBill(action('deed'), { ...INPUTS, price: null, assessment: -5 });
    expect(empty.interest?.euro).toBe(0);
    expect(empty.lines.find((current) => current.kind === 'tax')?.euro).toBe(0);
  });

  it('keeps an empty tax rate at the lower limit of the law', () => {
    const empty = computeBill(action('deed'), { ...INPUTS, taxRate: null });
    expect(empty.lines.find((current) => current.kind === 'tax')?.rate).toBe(0.1);
  });

  it('has no material interest, entry fee or tax for signatures without interest', () => {
    const signatures = computeBill(action('signatures'), { ...INPUTS, signatures: 2, vat: false });
    expect(signatures.interest).toBeUndefined();
    expect(signatures.lines).toEqual([{ kind: 'fee', euro: toEuro(7), leva: 7, ref: 'tarifa:5' }]);
  });
});
