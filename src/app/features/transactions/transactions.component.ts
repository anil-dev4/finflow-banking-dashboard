import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CalendarDatePipe } from '../../shared/calendar-date.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankingStore } from '../../core/banking.store';
import { EntryType, parseMoney } from '../../core/banking.models';
import { MoneyPipe } from '../../shared/money.pipe';
import { ModalComponent } from '../../shared/modal.component';
@Component({
  selector: 'app-transactions',
  imports: [CalendarDatePipe, ReactiveFormsModule, MoneyPipe, ModalComponent],
  templateUrl: './transactions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  readonly store = inject(BankingStore);
  private readonly route = inject(ActivatedRoute);
  readonly modal = viewChild.required(ModalComponent);
  readonly query = signal('');
  readonly type = signal('');
  readonly account = signal('');
  readonly page = signal(1);
  readonly pageSize = 7;
  readonly error = signal('');
  readonly message = signal('');
  readonly filtered = computed(() =>
    this.store
      .transactions()
      .filter(
        (t) =>
          `${t.id} ${t.description} ${this.store.accountName(t.accountId)}`
            .toLowerCase()
            .includes(this.query().toLowerCase()) &&
          (!this.type() || t.type === this.type()) &&
          (!this.account() || t.accountId === this.account()),
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
  );
  readonly pages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly visible = computed(() =>
    this.filtered().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize),
  );
  readonly form = new FormGroup({
    date: new FormControl('2026-09-29', { nonNullable: true, validators: [Validators.required] }),
    accountId: new FormControl('1001', { nonNullable: true, validators: [Validators.required] }),
    type: new FormControl<EntryType>('Debit', { nonNullable: true }),
    amount: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
  });
  constructor() {
    afterNextRender(() => {
      if (this.route.snapshot.queryParamMap.get('create') === 'true') this.open();
    });
  }
  open(): void {
    this.error.set('');
    this.form.reset({
      date: '2026-09-29',
      accountId: '1001',
      type: 'Debit',
      amount: '',
      description: '',
    });
    this.modal().open();
  }
  filter(field: 'query' | 'type' | 'account', value: string): void {
    this[field].set(value);
    this.page.set(1);
  }
  save(): void {
    const { amount, ...value } = this.form.getRawValue();
    const cents = parseMoney(amount);
    if (this.form.invalid || cents === null || cents <= 0) {
      this.error.set(
        'Complete every field. Enter a positive amount with at most 2 decimal places and a description of up to 120 characters.',
      );
      return;
    }
    try {
      this.store.addTransaction({ ...value, amountCents: cents });
      this.query.set('');
      this.type.set('');
      this.account.set('');
      this.page.set(1);
      this.modal().close();
      this.message.set('Transaction recorded. Balances and reports have been updated.');
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Unable to record transaction.');
    }
  }
}
