export type AccountType = 'Asset' | 'Liability' | 'Income' | 'Expense';
export type EntryType = 'Debit' | 'Credit';
export interface Account {
  readonly id: string;
  readonly name: string;
  readonly type: AccountType;
  readonly openingBalanceCents: number;
}
export interface Transaction {
  readonly id: string;
  readonly date: string;
  readonly accountId: string;
  readonly description: string;
  readonly type: EntryType;
  readonly amountCents: number;
}
export interface LedgerEntry extends Transaction {
  readonly balanceCents: number;
}

export function balanceChange(
  account: Account,
  entry: Pick<Transaction, 'type' | 'amountCents'>,
): number {
  const debitNormal = account.type === 'Asset' || account.type === 'Expense';
  return (entry.type === 'Debit') === debitNormal ? entry.amountCents : -entry.amountCents;
}

export function ledgerFor(account: Account, entries: readonly Transaction[]): LedgerEntry[] {
  let balanceCents = account.openingBalanceCents;
  return entries
    .filter((entry) => entry.accountId === account.id)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((entry) => ({ ...entry, balanceCents: (balanceCents += balanceChange(account, entry)) }));
}

/** Parse decimal currency directly into minor units. */
export function parseMoney(value: string): number | null {
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, fraction = ''] = value.trim().split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
