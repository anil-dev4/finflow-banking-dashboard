import { Account, balanceChange, ledgerFor, parseMoney, Transaction } from './banking.models';

describe('Money and ledger rules', () => {
  const account: Account = {
    id: '1001',
    name: 'Operating',
    type: 'Asset',
    openingBalanceCents: 10000,
  };
  const entry: Transaction = {
    id: 'TX-001',
    date: '2026-09-01',
    accountId: '1001',
    description: 'Sample',
    type: 'Debit',
    amountCents: 1250,
  };

  it('parses minor units without floating point rounding', () => {
    expect(parseMoney('0.29')).toBe(29);
    expect(parseMoney('1234.5')).toBe(123450);
    expect(parseMoney(' 0 ')).toBe(0);
  });
  it('rejects ambiguous, negative, oversized and over-precise amounts', () => {
    for (const value of ['1.001', '-5', '1,234', '1e3', '', 'NaN', '1000000000'])
      expect(parseMoney(value)).toBeNull();
  });
  it('uses the normal balance for each account type', () => {
    expect(balanceChange(account, entry)).toBe(1250);
    expect(balanceChange({ ...account, type: 'Expense' }, entry)).toBe(1250);
    expect(balanceChange({ ...account, type: 'Liability' }, entry)).toBe(-1250);
    expect(balanceChange({ ...account, type: 'Income' }, { ...entry, type: 'Credit' })).toBe(1250);
  });
  it('orders entries chronologically without mutating source data', () => {
    const entries: Transaction[] = [
      { ...entry, id: 'TX-002', date: '2026-09-05', type: 'Credit', amountCents: 500 },
      entry,
    ];
    const ledger = ledgerFor(account, entries);
    expect(ledger.map((row) => row.balanceCents)).toEqual([11250, 10750]);
    expect(entries[0].id).toBe('TX-002');
  });
  it('excludes entries belonging to other accounts', () => {
    expect(ledgerFor(account, [{ ...entry, accountId: 'different' }])).toEqual([]);
  });
});
