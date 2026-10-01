import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BankingStore } from '../../core/banking.store';
import { AccountType, parseMoney } from '../../core/banking.models';
import { MoneyPipe } from '../../shared/money.pipe';
import { ModalComponent } from '../../shared/modal.component';
@Component({
  selector: 'app-accounts',
  imports: [ReactiveFormsModule, MoneyPipe, ModalComponent, RouterLink],
  templateUrl: './accounts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent {
  readonly store = inject(BankingStore);
  private readonly route = inject(ActivatedRoute);
  readonly modal = viewChild.required(ModalComponent);
  readonly query = signal('');
  readonly type = signal('');
  readonly error = signal('');
  readonly message = signal('');
  readonly types: readonly AccountType[] = ['Asset', 'Liability', 'Income', 'Expense'];
  readonly filtered = computed(() =>
    this.store
      .accounts()
      .filter(
        (a) =>
          `${a.id} ${a.name}`.toLowerCase().includes(this.query().toLowerCase()) &&
          (!this.type() || a.type === this.type()),
      ),
  );
  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(60)],
    }),
    type: new FormControl<AccountType>('Asset', { nonNullable: true }),
    opening: new FormControl('0.00', { nonNullable: true, validators: [Validators.required] }),
  });
  constructor() {
    afterNextRender(() => {
      if (this.route.snapshot.queryParamMap.get('create') === 'true') this.open();
    });
  }
  open(): void {
    this.error.set('');
    this.form.reset({ name: '', type: 'Asset', opening: '0.00' });
    this.modal().open();
  }
  save(): void {
    const value = this.form.getRawValue();
    const cents = parseMoney(value.opening);
    if (this.form.invalid || cents === null) {
      this.error.set(
        'Enter a name (up to 60 characters) and a non-negative amount with at most 2 decimal places.',
      );
      return;
    }
    try {
      this.store.addAccount({ name: value.name, type: value.type, openingBalanceCents: cents });
      this.query.set('');
      this.type.set('');
      this.modal().close();
      this.message.set(`${value.name.trim()} was created.`);
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Unable to create account.');
    }
  }
}
