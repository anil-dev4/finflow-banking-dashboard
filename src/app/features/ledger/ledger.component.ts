import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CalendarDatePipe } from '../../shared/calendar-date.pipe';
import { ActivatedRoute } from '@angular/router';
import { BankingStore } from '../../core/banking.store';
import { ledgerFor } from '../../core/banking.models';
import { ExportService } from '../../core/export.service';
import { MoneyPipe } from '../../shared/money.pipe';
@Component({
  selector: 'app-ledger',
  imports: [CalendarDatePipe, MoneyPipe],
  templateUrl: './ledger.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LedgerComponent {
  readonly store = inject(BankingStore);
  readonly exporter = inject(ExportService);
  readonly accountId = signal(
    inject(ActivatedRoute).snapshot.queryParamMap.get('account') ?? '1001',
  );
  readonly from = signal('');
  readonly to = signal('');
  readonly invalidRange = computed(() => !!this.from() && !!this.to() && this.from() > this.to());
  readonly account = computed(
    () => this.store.accounts().find((a) => a.id === this.accountId()) ?? this.store.accounts()[0],
  );
  readonly allEntries = computed(() => ledgerFor(this.account(), this.store.transactions()));
  readonly entries = computed(() =>
    this.invalidRange()
      ? []
      : this.allEntries().filter(
          (e) => (!this.from() || e.date >= this.from()) && (!this.to() || e.date <= this.to()),
        ),
  );
  readonly opening = computed(
    () =>
      this.allEntries()
        .filter((e) => !!this.from() && e.date < this.from())
        .at(-1)?.balanceCents ?? this.account().openingBalanceCents,
  );
  readonly closing = computed(() => this.entries().at(-1)?.balanceCents ?? this.opening());
  readonly debit = computed(() =>
    this.entries()
      .filter((e) => e.type === 'Debit')
      .reduce((sum, e) => sum + e.amountCents, 0),
  );
  readonly credit = computed(() =>
    this.entries()
      .filter((e) => e.type === 'Credit')
      .reduce((sum, e) => sum + e.amountCents, 0),
  );
  export(): void {
    this.exporter.download(`finflow-ledger-${this.account().id}.csv`, [
      ['Account', this.account().name],
      ['Opening balance EUR', this.opening() / 100],
      ['Date', 'Reference', 'Description', 'Type', 'Amount EUR', 'Balance EUR'],
      ...this.entries().map((e) => [
        e.date,
        e.id,
        e.description,
        e.type,
        e.amountCents / 100,
        e.balanceCents / 100,
      ]),
      ['Closing balance EUR', this.closing() / 100],
    ]);
  }
}
