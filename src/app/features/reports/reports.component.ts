import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { BankingStore } from '../../core/banking.store';
import { ExportService } from '../../core/export.service';
import { ModalComponent } from '../../shared/modal.component';
import { MoneyPipe } from '../../shared/money.pipe';
type ReportKind = 'balances' | 'activity' | 'income';
@Component({
  selector: 'app-reports',
  imports: [ModalComponent, MoneyPipe],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {
  readonly store = inject(BankingStore);
  readonly exporter = inject(ExportService);
  readonly modal = viewChild.required(ModalComponent);
  readonly selected = signal<ReportKind>('balances');
  readonly generated = signal(false);
  readonly from = signal('');
  readonly to = signal('');
  readonly draftKind = signal<ReportKind>('balances');
  readonly draftFrom = signal('');
  readonly draftTo = signal('');
  readonly invalidRange = computed(
    () => !!this.draftFrom() && !!this.draftTo() && this.draftFrom() > this.draftTo(),
  );
  readonly reports: readonly {
    id: ReportKind;
    title: string;
    icon: string;
    description: string;
    tag: string;
  }[] = [
    {
      id: 'balances',
      title: 'Account balances',
      icon: '▣',
      description: 'Opening and current balances across your complete chart of accounts.',
      tag: 'ACCOUNT OVERVIEW',
    },
    {
      id: 'activity',
      title: 'Transaction register',
      icon: '⇄',
      description: 'A detailed record of debit and credit entries for a selected period.',
      tag: 'TRANSACTION ACTIVITY',
    },
    {
      id: 'income',
      title: 'Income & expenses',
      icon: '▥',
      description: 'Compare recorded income and expenses to understand your operating result.',
      tag: 'PERIOD SUMMARY',
    },
  ];
  readonly title = computed(
    () => this.reports.find((r) => r.id === this.selected())?.title ?? 'Report',
  );
  readonly draftTitle = computed(
    () => this.reports.find((report) => report.id === this.draftKind())?.title ?? 'Report',
  );
  readonly periodEntries = computed(() =>
    this.store
      .transactions()
      .filter(
        (e) => (!this.from() || e.date >= this.from()) && (!this.to() || e.date <= this.to()),
      ),
  );
  readonly income = computed(() =>
    this.periodEntries()
      .filter((e) => this.store.accounts().find((a) => a.id === e.accountId)?.type === 'Income')
      .reduce((sum, e) => sum + (e.type === 'Credit' ? e.amountCents : -e.amountCents), 0),
  );
  readonly expense = computed(() =>
    this.periodEntries()
      .filter((e) => this.store.accounts().find((a) => a.id === e.accountId)?.type === 'Expense')
      .reduce((sum, e) => sum + (e.type === 'Debit' ? e.amountCents : -e.amountCents), 0),
  );
  open(kind: ReportKind): void {
    this.draftKind.set(kind);
    this.draftFrom.set('');
    this.draftTo.set('');
    this.modal().open();
  }
  generate(): void {
    if (!this.invalidRange()) {
      this.selected.set(this.draftKind());
      this.from.set(this.draftFrom());
      this.to.set(this.draftTo());
      this.generated.set(true);
      this.modal().close();
    }
  }
  export(): void {
    let rows: (string | number)[][];
    if (this.selected() === 'balances') {
      rows = [
        ['Account code', 'Name', 'Type', 'Opening EUR', 'Current EUR'],
        ...this.store
          .accounts()
          .map((a) => [
            a.id,
            a.name,
            a.type,
            a.openingBalanceCents / 100,
            this.store.balance(a) / 100,
          ]),
      ];
    } else if (this.selected() === 'activity') {
      rows = [
        ['Date', 'Reference', 'Account', 'Description', 'Type', 'Amount EUR'],
        ...this.periodEntries().map((e) => [
          e.date,
          e.id,
          this.store.accountName(e.accountId),
          e.description,
          e.type,
          e.amountCents / 100,
        ]),
      ];
    } else {
      rows = [
        ['Metric', 'Amount EUR'],
        ['Income', this.income() / 100],
        ['Expenses', this.expense() / 100],
        ['Net result', (this.income() - this.expense()) / 100],
      ];
    }
    this.exporter.download(`finflow-${this.selected()}.csv`, [
      ['FinFlow demo report', this.title()],
      [
        'Period',
        this.selected() === 'balances'
          ? 'All recorded activity'
          : `${this.from() || 'Beginning'} to ${this.to() || 'Latest'}`,
      ],
      ...rows,
    ]);
  }
}
