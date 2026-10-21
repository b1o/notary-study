import { foldText } from './fold';

describe('foldText', () => {
  it('lowers the case', () => {
    expect(foldText('Нотариален Акт')).toBe('нотариален акт');
  });

  it('removes stress marks', () => {
    expect(foldText('ѝ')).toBe('и');
    expect(foldText('и\u0301ли')).toBe('или');
  });

  it('keeps й, which is a letter of its own', () => {
    expect(foldText('Край')).toBe('край');
  });
});
