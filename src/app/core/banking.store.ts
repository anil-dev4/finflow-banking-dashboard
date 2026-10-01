import { computed, Injectable, signal } from '@angular/core';
import { Account, ledgerFor, Transaction } from './banking.models';
import { DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from './demo-data';

@Injectable({ providedIn: 'root' })
export class BankingStore {
  private readonly accountState = signal<readonly Account[]>(DEMO_ACCOUNTS);
  private readonly transactionState = signal<readonly Transaction[]>(DEMO_TRANSACTIONS);
  readonly accounts = this.accountState.asReadonly();
  readonly transactions = this.transactionState.asReadonly();
  readonly totalDebit = computed(() => this.total('Debit'));
  readonly totalCredit = computed(() => this.total('Credit'));
  readonly assetBalance = computed(() =>
    this.accounts()
      .filter((a) => a.type === 'Asset')
      .reduce((total, account) => total + this.balance(account), 0),
  );
  accountName(id: string): string {
    return this.accounts().find((account) => account.id === id)?.name ?? 'Unknown account';
  }
  balance(account: Account): number {
    return (
      ledgerFor(account, this.transactions()).at(-1)?.balanceCents ?? account.openingBalanceCents
    );
  }
  addAccount(input: Omit<Account, 'id'>): void {
    if (
      !input.name.trim() ||
      this.accounts().some((a) => a.name.toLowerCase() === input.name.trim().toLowerCase())
    ) {
      throw new Error('Choose a unique account name.');
    }
    if (
      !['Asset', 'Liability', 'Income', 'Expense'].includes(input.type) ||
      !Number.isSafeInteger(input.openingBalanceCents) ||
      input.openingBalanceCents < 0
    ) {
      throw new Error('Enter a valid account type and opening balance.');
    }
    const id = String(Math.max(...this.accounts().map((a) => Number(a.id))) + 1);
    this.accountState.update((accounts) => [
      ...accounts,
      { ...input, name: input.name.trim(), id },
    ]);
  }
  addTransaction(input: Omit<Transaction, 'id'>): void {
    const validDate =
      /^\d{4}-\d{2}-\d{2}$/.test(input.date) &&
      Number.isFinite(Date.parse(input.date)) &&
      new Date(input.date).toISOString().slice(0, 10) === input.date;
    if (
      !this.accounts().some((a) => a.id === input.accountId) ||
      !validDate ||
      !input.description.trim() ||
      !['Debit', 'Credit'].includes(input.type) ||
      !Number.isSafeInteger(input.amountCents) ||
      input.amountCents <= 0
    ) {
      throw new Error('Provide an account, valid date, description and positive amount.');
    }
    const sequence = Math.max(0, ...this.transactions().map((t) => Number(t.id.slice(3)))) + 1;
    this.transactionState.update((entries) => [
      ...entries,
      {
        ...input,
        description: input.description.trim(),
        id: `TX-${String(sequence).padStart(3, '0')}`,
      },
    ]);
  }
  reset(): void {
    this.accountState.set(DEMO_ACCOUNTS);
    this.transactionState.set(DEMO_TRANSACTIONS);
  }
  private total(type: Transaction['type']): number {
    return this.transactions()
      .filter((entry) => entry.type === type)
      .reduce((sum, entry) => sum + entry.amountCents, 0);
  }
}
