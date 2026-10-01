import { BankingStore } from './banking.store';

describe('BankingStore', () => {
  let store: BankingStore;
  beforeEach(() => {
    store = new BankingStore();
  });
  it('updates the asset balance and debit total when a transaction is recorded', () => {
    const opening = store.assetBalance();
    const debit = store.totalDebit();
    store.addTransaction({
      accountId: '1001',
      date: '2026-09-29',
      description: 'Test payment',
      type: 'Debit',
      amountCents: 29,
    });
    expect(store.assetBalance()).toBe(opening + 29);
    expect(store.totalDebit()).toBe(debit + 29);
  });
  it('rejects invalid dates, unknown accounts, zero and fractional cents without modifying state', () => {
    const count = store.transactions().length;
    const entry = {
      accountId: '1001',
      date: '2026-09-29',
      description: 'Test',
      type: 'Debit' as const,
      amountCents: 100,
    };
    for (const invalid of [
      { ...entry, date: '2026-02-30' },
      { ...entry, accountId: 'missing' },
      { ...entry, amountCents: 0 },
      { ...entry, amountCents: 1.5 },
    ]) {
      expect(() => store.addTransaction(invalid)).toThrowError();
    }
    expect(store.transactions().length).toBe(count);
  });
  it('rejects duplicate names regardless of case or surrounding whitespace', () => {
    expect(() =>
      store.addAccount({ name: '  OPERATING ACCOUNT ', type: 'Asset', openingBalanceCents: 0 }),
    ).toThrowError('Choose a unique account name.');
  });
  it('creates unique transaction references and restores the demo', () => {
    const entry = {
      accountId: '1001',
      date: '2026-09-29',
      description: 'Test',
      type: 'Debit' as const,
      amountCents: 100,
    };
    const initial = store.transactions().length;
    store.addTransaction(entry);
    store.addTransaction(entry);
    expect(new Set(store.transactions().map((e) => e.id)).size).toBe(initial + 2);
    store.reset();
    expect(store.transactions().length).toBe(initial);
  });
});
